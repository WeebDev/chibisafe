'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';

import { openAPIClient } from '@/lib/serverFetch';

export const deleteAlbum = async (uuid: string) => {
	try {
		const { error } = await openAPIClient.DELETE('/api/v1/folders/{uuid}', {
			params: {
				path: {
					uuid
				}
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('files');
		revalidateTag('albums');
		return { message: 'Album deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const deleteAlbumAndFiles = async (uuid: string) => {
	try {
		const { error } = await openAPIClient.POST('/api/v1/folders/{uuid}/purge', {
			params: {
				path: {
					uuid
				}
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('files');
		revalidateTag('albums');
		return { message: 'Album purged', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const deleteLink = async (shareUuid: string, albumUuid: string) => {
	try {
		console.log('deleteLink', shareUuid, albumUuid);
		const { error } = await openAPIClient.DELETE('/api/v1/folders/{uuid}/share/{shareUuid}', {
			params: {
				path: {
					uuid: albumUuid,
					shareUuid
				}
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('links');
		return { message: 'Link deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const removeCollaborator = async (uuid: string, albumUuid: string) => {
	try {
		const { error } = await openAPIClient.DELETE('/api/v1/folders/{uuid}/collaborators/{collaboratorUuid}', {
			params: {
				path: {
					uuid: albumUuid,
					collaboratorUuid: uuid
				}
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('collaborators');
		return { message: 'Collaborator removed', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
