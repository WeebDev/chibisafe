import type { Metadata } from 'next';
import type { PageQuery } from '@/types';

import { Pagination } from '@/components/Pagination';
import { FilesWrapper } from '@/components/FilesWrapper';
import { FileDialog } from '@/components/dialogs/FileDialog';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Quarantine'
};

export default async function DashboardAdminQuarantinePage({ searchParams }: { readonly searchParams: PageQuery }) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	// TODO: Implement when the API is ready
	const response = {
		count: 0,
		results: []
	};

	return (
		<div className="px-2 w-full">
			<div className="grid gap-4">
				<Pagination itemsTotal={response.count} type="quarantine" />
				<FilesWrapper files={response.results} total={response.count} type="quarantine" />
				<Pagination itemsTotal={response.count} type="quarantine" />
				<FileDialog />
			</div>
		</div>
	);
}
