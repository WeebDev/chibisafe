import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import { redirect } from 'next/navigation';
import { IpTable } from '@/components/tables/ip-bans-table/IpTable';
import { BanIpDialog } from '@/components/dialogs/BanIpDialog';
import { Suspense } from 'react';
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
		<>
			<DashboardHeader
				title="Banned IPs"
				subtitle="Manage banned IPs"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Banned IPs', url: '/dashboard/admin/bans' }
				]}
			>
				<BanIpDialog />
			</DashboardHeader>
			<div className="px-2 w-full flex flex-col gap-4">
				<Suspense>
					<Pagination itemsTotal={data.count} />
				</Suspense>
				<IpTable data={data.results} />
			</div>
		</>
	);
}
