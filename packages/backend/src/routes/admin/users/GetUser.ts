import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import { constructFilePublicLink } from '@/utils/File';

export const options = {
	url: '/admin/user/:uuid',
	method: 'get',
	middlewares: ['auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) return res.code(400).send({ message: 'Invalid uuid supplied' });

	const user = await prisma.users.findUnique({
		where: {
			uuid
		},
		select: {
			uuid: true,
			username: true,
			enabled: true,
			isAdmin: true,
			createdAt: true,
			editedAt: true,
			apiKeyEditedAt: true
		}
	});

	if (!user) return res.code(404).send({ message: 'User not found' });

	return res.send({
		message: 'Successfully retrieved user',
		user
	});
};
