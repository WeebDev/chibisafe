import prisma from '@/structures/database';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { purgeUserFiles } from '@/utils/File';

export const options = {
	url: '/admin/user/:uuid/purge',
	method: 'post',
	middlewares: ['auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) {
		res.badRequest('Invalid uuid supplied');
		return;
	}

	const user = await prisma.users.findUnique({
		where: {
			uuid
		}
	});

	if (!user) {
		res.badRequest('User not found');
		return;
	}

	await purgeUserFiles(user.id);

	await prisma.albums.deleteMany({
		where: {
			userId: user.id
		}
	});

	return res.send({
		message: "Successfully purged user's files and albums"
	});
};
