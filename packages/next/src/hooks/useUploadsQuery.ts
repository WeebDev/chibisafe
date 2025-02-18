'use client';

import { openAPIClient } from '@/lib/clientFetch';
import type { FilePropsType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useUploadsQuery = ({
	currentPage,
	perPage,
	search = '',
	type,
	albumUuid
}: {
	readonly albumUuid?: string | undefined;
	readonly currentPage: number;
	readonly perPage: number;
	readonly search?: string;
	readonly type?: FilePropsType | undefined;
}) => {
	const isUploads = type === 'uploads';
	const isAlbumUploads = type === 'album' && Boolean(albumUuid);

	return useQuery({
		enabled: isUploads || isAlbumUploads,
		queryKey: isUploads
			? [
					'uploads',
					{
						currentPage,
						perPage,
						search
					}
				]
			: ['album', albumUuid, { currentPage, perPage, search }],
		queryFn: async () => {
			const { data, error, response } = await openAPIClient.GET(
				isUploads ? '/api/v1/files' : '/api/v1/folders/{uuid}/files',
				{
					// @ts-ignore
					params: {
						...(isUploads ? {} : { path: { uuid: albumUuid! } }),
						query: {
							offset: currentPage - 1,
							limit: perPage,
							search
						}
					}
				}
			);

			if (error && response.status === 401) {
				throw new Error(error.message);
			}

			return data;
		}
	});
};
