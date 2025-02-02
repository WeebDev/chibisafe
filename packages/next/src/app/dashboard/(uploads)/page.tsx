import type { Metadata } from 'next';
import type { PageQuery } from '@/types';

import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { Pagination } from '@/components/Pagination';
import { FilesWrapper } from '@/components/FilesWrapper';
import { FileDialog } from '@/components/dialogs/FileDialog';
import { openAPIClient } from '@/lib/serverFetch';
import { GlobalDropZone } from '@/components/Dropzone';

export const metadata: Metadata = {
	title: 'Dashboard - Uploads'
};

export default async function DashboardPage({ searchParams }: { readonly searchParams: PageQuery }) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ['uploads', { currentPage, perPage, search }],
		queryFn: async () => {
			const { data } = await openAPIClient.GET('/api/v1/files', {
				params: {
					query: {
						offset: currentPage - 1,
						limit: perPage,
						search
					}
				}
			});

			return data;
		}
	});

	return (
		<div className="px-2 w-full">
			<HydrationBoundary state={dehydrate(queryClient)}>
				<div className="grid gap-4">
					<Pagination type="uploads" />
					<FilesWrapper type="uploads" />
					<Pagination type="uploads" />
					<FileDialog />
				</div>
			</HydrationBoundary>
			<GlobalDropZone />
		</div>
	);
}
