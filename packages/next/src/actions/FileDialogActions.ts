'use server';

import { MessageType } from '@/types';
import { revalidateTag } from 'next/cache';
import { openAPIClient } from '@/lib/serverFetch';

export const deleteFile = async (uuid: string) => {
	try {
		const { error } = await openAPIClient.POST('/api/v1/files/bulk-delete', {
			body: {
				uuids: [uuid]
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('files');

		return { message: 'File deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const unquarantineFile = async (uuid: string) => {
	try {
		const { error } = await openAPIClient.DELETE('/api/v1/files/{uuid}/quarantine', {
			params: {
				path: {
					uuid
				}
			}
		});

		if (error) return { message: error, type: MessageType.Error };
		revalidateTag('files');

		return { message: 'File unquarantined', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const quarantineFile = async (uuid: string) => {
	try {
		const { error } = await openAPIClient.POST('/api/v1/files/{uuid}/quarantine', {
			params: {
				path: {
					uuid
				}
			},
			body: {}
		});

		if (error) return { message: error, type: MessageType.Error };
		revalidateTag('files');

		return { message: 'File quarantined', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const regenerateThumbnail = async (uuid: string) => {
	try {
		const { error } = await openAPIClient.POST('/api/v1/files/{uuid}/regenerate-thumbnail', {
			params: {
				path: {
					uuid
				}
			}
		});

		if (error) return { message: error, type: MessageType.Error };
		revalidateTag('files');

		return { message: 'Thumbnail regenerated', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
