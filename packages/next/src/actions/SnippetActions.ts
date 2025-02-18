'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';

export const createSnippet = async (_: any, form: FormData) => {
	// const name = form.get('name') as string;
	// const content = form.get('content') as string;
	// const language = form.get('language') as string;
	// if (!name) return { message: 'Name is required', type: MessageType.Error };
	// if (!content) return { message: 'Content is required', type: MessageType.Error };

	// try {
	// 	const { error } = await request.post({
	// 		url: 'snippet/create',
	// 		body: {
	// 			name,
	// 			content,
	// 			language: language ?? 'auto-detect'
	// 		},
	// 		headers: {
	// 			authorization: `Bearer ${getToken()}`
	// 		},
	// 		options: {
	// 			next: {
	// 				tags: ['snippets']
	// 			}
	// 		}
	// 	});

	// 	if (error) return { message: error, type: MessageType.Error };

	// 	revalidateTag('snippets');
	// 	return { message: 'Snippet created', type: MessageType.Success };
	// } catch (error: any) {
	// 	return { message: error, type: MessageType.Error };
	// }
	return { message: 'Not implemented yet', type: MessageType.Error };
};

export const deleteSnippet = async (_: any, form: FormData) => {
	// const uuid = form.get('uuid') as string;

	// try {
	// 	const { error } = await request.delete({
	// 		url: `snippet/${uuid}`,
	// 		headers: {
	// 			authorization: `Bearer ${getToken()}`
	// 		},
	// 		options: {
	// 			next: {
	// 				tags: ['snippets']
	// 			}
	// 		}
	// 	});

	// 	if (error) return { message: error, type: MessageType.Error };

	// 	return { message: 'Snippet deleted', type: MessageType.Success };
	// } catch (error: any) {
	// 	return { message: error, type: MessageType.Error };
	// }
	return { message: 'Not implemented yet', type: MessageType.Error };
};
