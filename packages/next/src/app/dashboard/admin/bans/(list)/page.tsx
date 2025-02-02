import type { Metadata } from 'next';

import { redirect } from 'next/navigation';
import { IpTable } from '@/components/tables/ip-bans-table/IpTable';
import { Pagination } from '@/components/Pagination';
import type { PageQuery } from '@/types';
import { openAPIClient } from '@/lib/serverFetch';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Banned IPs'
};

export default async function DashboardAdminIPsPage({ searchParams }: { readonly searchParams: PageQuery }) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const { data, error, response } = await openAPIClient.GET('/api/v1/ip-bans', {
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

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div className="px-2 w-full flex flex-col gap-4">
			<Pagination itemsTotal={data.count} />
			<IpTable data={data.results} />
		</div>
	);
}
