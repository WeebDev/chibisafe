'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';
import { openAPIClient } from '@/lib/serverFetch';

export const unbanIp = async (uuid: string) => {
	try {
		const { error } = await openAPIClient.DELETE('/api/v1/ip-bans/{uuid}', {
			params: {
				path: {
					uuid
				}
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('ips');
		return { message: 'IP unbanned', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const banIp = async (_: any, form: FormData) => {
	const ip = form.get('ip') as string;
	const reason = form.get('reason') as string;

	try {
		const { error } = await openAPIClient.POST('/api/v1/ip-bans', {
			body: {
				ip,
				reason
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('ips');
		return { message: 'IP banned', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const purgeIp = async (uuid: string) => {
	try {
		const { error } = await openAPIClient.POST('/api/v1/ip-bans/{uuid}/purge', {
			params: {
				path: {
					uuid
				}
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('ips');
		return { message: 'IP files purged', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
