import { basename, extname } from 'node:path';
import process from 'node:process';
import { URL, fileURLToPath } from 'node:url';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { processFile } from '@chibisafe/uploader-module';
import slugify from '@sindresorhus/slugify';
import type { FastifyReply } from 'fastify';
// import { processFile } from '../../../../../../chibisafe-uploader/packages/uploader-module/lib';
import { z } from 'zod';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { SETTINGS } from '@/structures/settings.js';
import { getUniqueFileIdentifier, constructFilePublicLink, deleteTmpFile, handleUploadFile } from '@/utils/File.js';
import { validateAlbum } from '@/utils/UploadHelpers.js';
import { getUsedQuota } from '@/utils/User.js';

export const schema = {
	summary: 'Upload file',
	description: 'Uploads a file',
	tags: ['Files'],
	headers: z.object({
		albumuuid: z.string().optional().describe('The uuid of the album.'),
		'chibi-chunk-number': z.coerce.number().optional().describe('The chunk number.'),
		'chibi-chunks-total': z.coerce.number().optional().describe('The total number of chunks.'),
		'chibi-uuid': z.string().optional().describe('The uuid of the file.')
	}),
	body: z
		.object({
			size: z.number().describe('The size of the file.'),
			name: z.string().describe('The name of the file.'),
			contentType: z.string().describe('The content type of the file.')
		})
		.or(z.null()),
	response: {
		200: z
			.object({
				name: z.string().describe('The name of the file.'),
				uuid: z.string().describe('The uuid of the file.'),
				url: z.string().describe('The URL of the file.'),
				identifier: z.string().optional().describe('The identifier of the file.'),
				publicUrl: z.string().optional().describe('The public URL of the file.')
			})
			.or(
				z.object({
					url: z.string().describe('The URL of the file.'),
					identifier: z.string().optional().describe('The identifier of the file.'),
					publicUrl: z.string().optional().describe('The public URL of the file.')
				})
			),
		204: z.null(),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/upload',
	method: 'post',
	middlewares: [
		{
			name: 'apiKey'
		},
		{
			name: 'auth',
			optional: true
		}
	]
};

export const uploadToNetworkStorage = async (req: RequestWithUser, res: FastifyReply) => {
	const { contentType, size, name } = req.body as { contentType: string; name: string; size: number };
	if (!contentType || !size || !name) {
		void res.badRequest('Missing file information');
		return;
	}

	const quota = await getUsedQuota(req.user?.id as number);
	if (quota?.overQuota) {
		void res.forbidden('You are over your storage quota');
		return;
	}

	if (!SETTINGS.publicMode && !req.user) {
		void res.unauthorized('Only registered users are allowed to upload files.');
		return;
	}

	const fileExtension = `.${name.split('.').pop()!}`.toLowerCase();
	if (SETTINGS.blockedExtensions.includes(fileExtension)) {
		void res.badRequest('File type is not allowed.');
		return;
	}

	// Assign a unique identifier to the file
	const uniqueIdentifier = await getUniqueFileIdentifier();
	if (!uniqueIdentifier) throw new Error('Could not generate unique identifier.');

	const ext = extname(name);
	let newFilename = `${uniqueIdentifier}${ext}`;
	if (SETTINGS.generateOriginalFileNameWithIdentifier) {
		const isLowerCase = !SETTINGS.enableMixedCaseFilenames || process.platform === 'win32';
		const originalNameWithoutExt = basename(name, ext);
		newFilename = `${slugify(originalNameWithoutExt, { separator: '_', lowercase: isLowerCase })}-${uniqueIdentifier}${ext}`;
	}

	try {
		const { createS3Client } = await import('@/structures/s3.js');
		const url = await getSignedUrl(
			createS3Client(),
			new PutObjectCommand({
				Bucket: SETTINGS.S3Bucket,
				Key: newFilename,
				ContentType: contentType,
				ContentLength: size
			}),
			{ expiresIn: 3600 }
		);

		await res.code(200).send({
			url,
			identifier: newFilename,
			publicUrl: `${SETTINGS.S3PublicUrl || SETTINGS.S3Endpoint}/${newFilename}`
		});
	} catch (error) {
		req.log.error(error);
		void res.internalServerError('Could not generate signed URL');
	}
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	if (SETTINGS.useNetworkStorage) return uploadToNetworkStorage(req, res);

	const tmpDir = fileURLToPath(new URL('../../../../../uploads/tmp', import.meta.url));
	const maxChunkSize = SETTINGS.chunkSize;
	const maxFileSize = SETTINGS.maxSize;

	const quota = await getUsedQuota(req.user?.id as number);
	if (quota?.overQuota) {
		void res.forbidden('You are over your storage quota');
		return;
	}

	try {
		if (!SETTINGS.publicMode && !req.user) {
			void res.unauthorized('Only registered users are allowed to upload files.');
			return;
		}

		const upload = await processFile(req.raw, {
			destination: tmpDir,
			maxFileSize,
			maxChunkSize,
			debug: process.env.NODE_ENV !== 'production'
		});

		if (upload.isChunkedUpload && !upload.ready) {
			return await res.code(204).send();
		}

		if (!upload.metadata.name) {
			await deleteTmpFile(upload.path as string);
			void res.badRequest('Missing file name.');
			return;
		}

		const fileExtension = `.${upload.metadata.name.split('.').pop()!}`.toLowerCase();
		if (SETTINGS.blockedExtensions.includes(fileExtension)) {
			await deleteTmpFile(upload.path as string);
			void res.badRequest('File type is not allowed.');
			return;
		}

		// Check if the new uploaded file sends the user over the quota
		const quotaAfterUpload = await getUsedQuota(req.user?.id as number, Number(upload.metadata.size));
		if (quotaAfterUpload?.overQuota) {
			await deleteTmpFile(upload.path as string);
			void res.forbidden('You are over your storage quota');
			return;
		}

		const album = await validateAlbum(req.headers.albumuuid as string, req.user ? req.user : undefined);

		// set realIP to make sure it is returning the right IP address for some proxies
		let realIP = req.ip;
		if (req.headers['cf-connecting-ip']) {
			realIP = req.headers['cf-connecting-ip'] as string;
		}

		if (req.headers['x-forwarded-for']) {
			realIP = req.headers['x-forwarded-for'] as string;
		}

		const uploadedFile = await handleUploadFile({
			user: req.user,
			ip: realIP,
			upload: {
				name: upload.metadata.name,
				path: upload.path as string,
				type: upload.metadata.type as string,
				size: upload.metadata.size ?? '0'
			},
			album
		});

		const linkData = constructFilePublicLink({ req, fileName: uploadedFile.name });
		// Construct public link
		const fileWithLink = {
			...uploadedFile,
			...linkData
		};

		await res.code(200).send(fileWithLink);
	} catch (error: any) {
		switch (error.message) {
			case 'Chunked upload is above size limit':
			case 'Chunk is too big':
			case 'File is too big':
				void res.payloadTooLarge(error.message);
				break;
			case 'Missing chibi-* headers':
			case 'chibi-uuid is not a string':
			case 'chibi-uuid does not meet the length criteria':
			case 'chibi-uuid is not a valid uuid':
			case 'Chunk is out of range':
			case 'Invalid headers':
				void res.badRequest(error.message);
				break;
		}

		res.log.error(error);
	}
};
