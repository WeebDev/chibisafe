import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import { UserTable } from '@/components/tables/user-table/UserTable';
import { redirect } from 'next/navigation';
import type { PageQuery } from '@/types';
import { Suspense } from 'react';
import { Pagination } from '@/components/Pagination';
import { openAPIClient } from '@/lib/serverFetch';
import { CreateUserDialog } from '@/components/dialogs/CreateUserDialog';

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
		<>
			<DashboardHeader
				title="Users"
				subtitle="Manage all users"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Users', url: '/dashboard/admin/users' }
				]}
			>
				<CreateUserDialog />
			</DashboardHeader>
			<div className="px-2 w-full flex flex-col gap-4">
				<Suspense>
					<Pagination itemsTotal={data?.count} />
				</Suspense>
				<UserTable data={data?.results} />
			</div>
		</>
	);
}
