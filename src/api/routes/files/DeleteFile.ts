import type { Response } from 'hyper-express';
import prisma from '../../structures/database';
import { RequestWithUser } from '../../structures/interfaces';
import { deleteFile } from '../../utils/File';

export const options = {
	url: '/file/:uuid',
	method: 'delete',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { uuid } = req.path_parameters;
	if (!uuid) return res.status(400).json({ message: 'No uuid provided' });

	const file = await prisma.files.findFirst({
		where: {
			userId: req.user.id,
			uuid
		}
	});

	if (!file) return res.status(400).json({ message: "The file doesn't exist or doesn't belong to the user" });

	// Delete the file from the DB
	await prisma.files.delete({
		where: {
			uuid
		}
	});

	// Remove the file from disk
	await deleteFile(file.name);

	// TODO: Remove all relations from fileTags and albumsFiles

	return res.json({
		message: 'Successfully deleted the file'
	});
};
