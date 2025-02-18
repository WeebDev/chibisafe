'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';
import { openAPIClient } from '@/lib/serverFetch';

export const enableUser = async (uuid: string) => {
	try {
		const { error } = await openAPIClient.PATCH('/api/v1/users/{uuid}', {
			params: { path: { uuid } },
			body: {
				enabled: true
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('users');
		return { message: 'User enabled', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const disableUser = async (uuid: string) => {
	try {
		const { error } = await openAPIClient.PATCH('/api/v1/users/{uuid}', {
			params: { path: { uuid } },
			body: {
				enabled: false
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('users');
		return { message: 'User disabled', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const purgeUser = async (uuid: string) => {
	try {
		const { error } = await openAPIClient.POST('/api/v1/users/{uuid}/purge', {
			params: { path: { uuid } }
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('users');
		return { message: 'User purged', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const createUser = async (_: any, form: FormData) => {
	const username = form.get('username') as string;
	const password = form.get('password') as string;
	const rePassword = form.get('repassword') as string;

	if (!username) return { message: 'Username is required', type: MessageType.Error };
	if (!password) return { message: 'Password is required', type: MessageType.Error };
	if (!rePassword) return { message: 'Repeat password is required', type: MessageType.Error };
	if (password !== rePassword) return { message: 'Passwords do not match', type: MessageType.Error };

	try {
		const { error } = await openAPIClient.POST('/api/v1/users', {
			body: {
				username,
				password
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('users');
		return { message: 'User created', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
