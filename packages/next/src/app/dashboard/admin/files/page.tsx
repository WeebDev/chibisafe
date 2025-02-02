import type { Metadata } from 'next';
import type { PageQuery } from '@/types';

import { redirect } from 'next/navigation';
import { Pagination } from '@/components/Pagination';
import { FilesWrapper } from '@/components/FilesWrapper';
import { FileDialog } from '@/components/dialogs/FileDialog';
import { openAPIClient } from '@/lib/serverFetch';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Files'
};

export default async function AdminFilesPage({ searchParams }: { readonly searchParams: PageQuery }) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';
	const anonymous = searchParams.publicOnly ?? false;

	const { data, error, response } = await openAPIClient.GET('/api/v1/files', {
		params: {
			query: {
				offset: currentPage - 1,
				limit: perPage,
				search,
				admin: true,
				anonymous
			}
		}
	});

	if (response.status === 401) {
		redirect('/login');
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div className="px-2 w-full">
			<div className="grid gap-4">
				<Pagination itemsTotal={data.count} type="admin" />
				<FilesWrapper files={data.results} total={data.count} type="admin" />
				<Pagination itemsTotal={data.count} type="admin" />
				<FileDialog />
			</div>
		</div>
	);
}
