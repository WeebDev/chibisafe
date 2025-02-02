import type { Metadata } from 'next';

import { UserTable } from '@/components/tables/user-table/UserTable';
import { redirect } from 'next/navigation';
import type { PageQuery } from '@/types';
import { Pagination } from '@/components/Pagination';
import { openAPIClient } from '@/lib/serverFetch';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Users'
};

export default async function DashboardAdminUsersPage({ searchParams }: { readonly searchParams: PageQuery }) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const { data, response } = await openAPIClient.GET('/api/v1/users', {
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
			<UserTable data={data?.results} />
		</div>
	);
}
