import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Pagination } from '@/components/Pagination';
import { openAPIClient } from '@/lib/serverFetch';
import { RolesTable } from '@/components/tables/roles-table/RolesTable';
import { CreateRoleDialog } from '@/components/dialogs/roles/CreateRoleDialog';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - IPs'
};

export default async function DashboardAdminIPsPage() {
	const { data, error, response } = await openAPIClient.GET('/api/v1/roles');

	if (response.status === 401) {
		redirect('/login');
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<>
			<DashboardHeader
				title="Roles"
				subtitle="Create and modify roles"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Roles', url: '/dashboard/admin/roles' }
				]}
			>
				<CreateRoleDialog />
			</DashboardHeader>
			<div className="px-2 w-full flex flex-col gap-4">
				<Suspense>
					<Pagination itemsTotal={data.count} />
				</Suspense>
				{/* @ts-expect-error permissions doesnt exist in the schema, remove whhen it does */}
				<RolesTable data={data.results} />
			</div>
		</>
	);
}
