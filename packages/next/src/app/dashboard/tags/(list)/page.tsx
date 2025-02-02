import type { Metadata } from 'next';

import { redirect } from 'next/navigation';
import { TagsTable } from '@/components/tables/tags-table/TagsTable';
import type { PageQuery } from '@/types';
import { Pagination } from '@/components/Pagination';
import { openAPIClient } from '@/lib/serverFetch';

export const metadata: Metadata = {
	title: 'Dashboard - Tags'
};

export default async function DashboardTagsPage({ searchParams }: { readonly searchParams: PageQuery }) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const { data, response } = await openAPIClient.GET('/api/v1/tags', {
		params: {
			query: {
				offset: currentPage - 1,
				limit: perPage,
				search
			}
		}
	});

	if (response.status === 401) {
		redirect('/login');
	}

	return (
		<div className="px-2 w-full flex flex-col gap-4">
			<Pagination itemsTotal={data?.count} />
			<TagsTable data={data?.results} />
		</div>
	);
}
