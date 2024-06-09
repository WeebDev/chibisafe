'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';
import { openAPIClient } from '@/lib/serverFetch';

export const deleteRole = async (uuid: string) => {
	try {
		const { error } = await openAPIClient.DELETE('/api/v1/roles/{uuid}/', {
			params: {
				path: {
					uuid
				}
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('roles');
		return { message: 'Role deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const createRole = async (name: string) => {
	try {
		const { error } = await openAPIClient.POST('/api/v1/roles/', {
			body: {
				name
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('roles');
		return { message: 'Role created', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const setRoleQuota = async (uuid: string, quota: string) => {
	try {
		const { error } = await openAPIClient.PATCH('/api/v1/roles/{uuid}/storage/', {
			params: {
				path: {
					uuid
				}
			},
			body: {
				storageQuota: Number.parseInt(quota, 10)
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('roles');
		return { message: 'Role quota set', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const setRolePermissions = async (uuid: string, permissions: string) => {
	try {
		const perms = JSON.parse(permissions);
		const { error } = await openAPIClient.PATCH('/api/v1/roles/{uuid}/permissions/', {
			params: {
				path: {
					uuid
				}
			},
			body: {
				...perms
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('roles');
		return { message: 'Role permissions set', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
