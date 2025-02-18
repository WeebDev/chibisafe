'use client';

import { useSetAtom } from 'jotai';
import { forwardRef, useCallback } from 'react';
import type { FileTriggerProps } from 'react-aria-components';
import { FileTrigger } from '@/components/ui/file-trigger';
import { chunkFile, uploadChunks } from '@/lib/upload';
import { uploadsQueueAtom } from '@/lib/atoms/uploads';
import { customRevalidatePath } from '@/actions/Revalidate';
import { ENV } from '@/util/env';

interface FileTriggerPropsWithAlbumUuid extends FileTriggerProps {
	readonly albumUuid?: string;
}

export const UploadTrigger = forwardRef<HTMLInputElement, FileTriggerPropsWithAlbumUuid>((props, ref) => {
	const { children, ...additionalProps } = props;
	const setUploadsQueue = useSetAtom(uploadsQueueAtom);

	const onSelect = useCallback(
		async (files: FileList | null) => {
			if (!files) {
				return;
			}

			for (const file of files) {
				const chunks = await chunkFile(file, 90 * 1_024 * 1_024);

				void uploadChunks({
					chunks,
					filename: file.name,
					onStart(uuid) {
						setUploadsQueue(draft => {
							draft.push({
								uuid,
								finished: false,
								percentComplete: 0,
								uploadSpeed: 0,
								url: '',
								name: file.name
							});
						});
					},
					onProgress(uuid, _idx, _totalChunks, _lastChunk, percentComplete, uploadSpeed) {
						setUploadsQueue(draft => {
							const upload = draft.find(up => up.uuid === uuid);
							if (upload) {
								upload.percentComplete = percentComplete;
								upload.uploadSpeed = uploadSpeed;
							}
						});
					},
					onError(uuid, message) {
						setUploadsQueue(draft => {
							const upload = draft.find(up => up.uuid === uuid);
							if (upload) {
								upload.finished = true;
								upload.uploadSpeed = 0;
								upload.error = message;
							}
						});
					},
					async onFinish(uuid, filename) {
						setUploadsQueue(draft => {
							const upload = draft.find(up => up.uuid === uuid);
							if (upload) {
								upload.finished = true;
								upload.percentComplete = 100;
								upload.uploadSpeed = 0;
								upload.url = `${ENV.BASE_API_URL}/${filename}`;
							}
						});
						await customRevalidatePath('/dashboard');
					}
				});

				// TODO: Implement network storage
				// files.map(async file => {
				// 	uploadQueue.add(async () => {
				// 		const actualFile = file instanceof File ? file : await file.getFile();
				// 		const { url, identifier, publicUrl, error } = await getSignedUrl(actualFile);
				// 		if (error) {
				// 			toast.error(error);
				// 			return;
				// 		}

				// 		await uploadFile({
				// 			file: actualFile,
				// 			endpoint: url,
				// 			isNetworkStored: true,
				// 			method: 'PUT',
				// 			identifier,
				// 			publicUrl
				// 		});
				// 	});
				// });
			}
		},
		[setUploadsQueue]
	);

	return (
		<FileTrigger {...additionalProps} onSelect={onSelect} ref={ref} allowsMultiple>
			{children}
		</FileTrigger>
	);
});
