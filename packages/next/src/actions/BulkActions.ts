'use server';

import { MessageType } from '@/types';
import { revalidateTag } from 'next/cache';
import { openAPIClient } from '@/lib/serverFetch';

export const regenerateThumbnails = async (uuids: string[]) => {
	try {
		await openAPIClient.POST('/api/v1/files/bulk-regenerate-thumbnails', {
			body: {
				uuids
			}
		});

		revalidateTag('files');
		return {
			message: `${uuids.length} ${uuids.length > 1 ? 'files' : 'file'} thumbnail${uuids.length > 1 ? 's' : ''} regenerated`,
			type: MessageType.Success
		};
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const deleteFiles = async (uuids: string[]) => {
	try {
		// If the user is admin it changes nothing, same endpoint.
		// If the user is not admin it will only delete the files that the user owns.
		await openAPIClient.POST('/api/v1/files/bulk-delete', {
			body: {
				uuids
			}
		});

		revalidateTag('files');
		return { message: `${uuids.length} ${uuids.length > 1 ? 'files' : 'file'} removed`, type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const quarantineFiles = async (uuids: string[]) => {
	try {
		await openAPIClient.POST('/api/v1/files/bulk-quarantine', {
			body: {
				uuids
			}
		});

		revalidateTag('files');
		return {
			message: `${uuids.length} ${uuids.length > 1 ? 'files' : 'file'} quarantined`,
			type: MessageType.Success
		};
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const unquarantineFiles = async (uuids: string[]) => {
	try {
		await openAPIClient.POST('/api/v1/files/bulk-unquarantine', {
			body: {
				uuids
			}
		});

		revalidateTag('files');
		return {
			message: `${uuids.length} ${uuids.length > 1 ? 'files' : 'file'} unquarantined`,
			type: MessageType.Success
		};
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
