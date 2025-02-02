import type { Metadata } from 'next';

import { redirect } from 'next/navigation';
import { Pagination } from '@/components/Pagination';
import { openAPIClient } from '@/lib/serverFetch';
import { RolesTable } from '@/components/tables/roles-table/RolesTable';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Roles'
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
		<div className="px-2 w-full flex flex-col gap-4">
			<Pagination itemsTotal={data.count} />
			{/* @ts-expect-error permissions doesnt exist in the schema, remove whhen it does */}
			<RolesTable data={data.results} />
		</div>
	);
}
