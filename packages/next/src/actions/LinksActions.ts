'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';

export const createShortURL = async (_: any, form: FormData) => {
	// const url = form.get('url') as string;
	// const vanity = form.get('vanity') as string;

	// try {
	// 	const { error } = await request.post({
	// 		url: 'link/create',
	// 		headers: {
	// 			authorization: `Bearer ${getToken()}`
	// 		},
	// 		body: {
	// 			url,
	// 			vanity: vanity || undefined
	// 		}
	// 	});

	// 	if (error) return { message: error, type: MessageType.Error };

	// 	revalidateTag('links');
	// 	return { message: 'Link created', type: MessageType.Success };
	// } catch (error: any) {
	// 	return { message: error, type: MessageType.Error };
	// }
	return { message: 'Not implemented yet', type: MessageType.Error };
};

export const deleteLink = async (identifier: string) => {
	// try {
	// 	const { error } = await request.delete({
	// 		url: `link/${identifier}`,
	// 		headers: {
	// 			authorization: `Bearer ${getToken()}`
	// 		}
	// 	});

	// 	if (error) return { message: error, type: MessageType.Error };

	// 	revalidateTag('links');
	// 	return { message: 'Link deleted', type: MessageType.Success };
	// } catch (error: any) {
	// 	return { message: error, type: MessageType.Error };
	// }
	return { message: 'Not implemented yet', type: MessageType.Error };
};

export const deleteLinkAsAdmin = async (identifier: string) => {
	// try {
	// 	const { error } = await request.delete({
	// 		url: `admin/link/${identifier}`,
	// 		headers: {
	// 			authorization: `Bearer ${getToken()}`
	// 		}
	// 	});

	// 	if (error) return { message: error, type: MessageType.Error };

	// 	revalidateTag('links');
	// 	return { message: 'Link deleted', type: MessageType.Success };
	// } catch (error: any) {
	// 	return { message: error, type: MessageType.Error };
	// }
	return { message: 'Not implemented yet', type: MessageType.Error };
};
