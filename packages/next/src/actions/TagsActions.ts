'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';
import { openAPIClient } from '@/lib/serverFetch';

export const createTag = async (name: string, parentsUuid?: string[]) => {
	console.log(parentsUuid);
	if (!name) return { message: 'Name is required', type: MessageType.Error };

	try {
		const { error } = await openAPIClient.POST('/api/v1/tags', {
			body: {
				...(parentsUuid?.length ? { parents: parentsUuid } : null),
				name
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('tags');
		return { message: 'Tag created', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const deleteTag = async (uuid: string) => {
	try {
		const { error } = await openAPIClient.DELETE(`/api/v1/tags/{uuid}`, {
			params: {
				path: {
					uuid
				}
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('tags');
		return { message: 'Tag deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
