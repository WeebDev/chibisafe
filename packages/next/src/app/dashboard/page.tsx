import type { Metadata } from 'next';
import type { PageQuery } from '@/types';
import { Plus } from 'lucide-react';

import { DashboardHeader } from '@/components/DashboardHeader';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { UploadTrigger } from '@/components/UploadTrigger';
import { Button } from '@/components/ui/react-aria-button';
import { buttonVariants } from '@/styles/button';
import { GlobalDropZone } from '@/components/Dropzone';
import { Suspense } from 'react';
import { Pagination } from '@/components/Pagination';
import { FilesWrapper } from '@/components/FilesWrapper';
import { FileDialog } from '@/components/dialogs/FileDialog';
import { openAPIClient } from '@/lib/serverFetch';

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
		<>
			<DashboardHeader title="Uploads" subtitle="Manage your uploads">
				<UploadTrigger allowsMultiple>
					<Button className={buttonVariants()}>
						<Plus className="mr-2 h-4 w-4" />
						Upload file
					</Button>
				</UploadTrigger>
			</DashboardHeader>
			<div className="px-2 w-full">
				<HydrationBoundary state={dehydrate(queryClient)}>
					<div className="grid gap-4">
						<Suspense>
							<Pagination type="uploads" />
							<FilesWrapper type="uploads" />
							<Pagination type="uploads" />
						</Suspense>
						<FileDialog />
					</div>
				</HydrationBoundary>
			</div>
			<GlobalDropZone />
		</>
	);
}
