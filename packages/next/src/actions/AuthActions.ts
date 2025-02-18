'use server';

import { MessageType } from '@/types';
import { revalidateTag } from 'next/cache';
import { openAPIClient } from '@/lib/serverFetch';

export const changePassword = async (_: any, form: FormData) => {
	const password = form.get('currentpassword') as string;
	const newPassword = form.get('newpassword') as string;
	const rePassword = form.get('repassword') as string;

	if (!password) return { message: 'Password is required', type: MessageType.Error };
	if (!newPassword) return { message: 'New password is required', type: MessageType.Error };
	if (!rePassword) return { message: 'Repeat password is required', type: MessageType.Error };
	if (newPassword !== rePassword) return { message: 'Passwords do not match', type: MessageType.Error };

	try {
		const { error } = await openAPIClient.PATCH('/api/v1/users/me', {
			body: {
				oldPassword: password,
				newPassword
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('me');
		return { message: 'Password changed', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const requestNewApiKey = async (_: any, __: FormData) => {
	try {
		const { error } = await openAPIClient.POST('/api/v1/users/me/regenerate-api-key', {
			// @ts-expect-error schema is wrong, we need an empty body
			body: {}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('me');
		return { message: 'API key regenerated', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
