'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';
import { openAPIClient } from '@/lib/serverFetch';

export const createInvite = async (_: FormData) => {
	try {
		const { error } = await openAPIClient.POST('/api/v1/invites', {
			body: {}
		});

		if (error) return { message: error.message, type: MessageType.Error };
		revalidateTag('invites');
		return {};
	} catch {
		return {};
	}
};

export const revokeInvite = async (uuid: string) => {
	try {
		const { error } = await openAPIClient.DELETE('/api/v1/invites/{uuid}', {
			params: {
				path: {
					uuid
				}
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };
		revalidateTag('invites');
		return { message: 'Invite revoked', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
