import type { Metadata } from 'next';

import { redirect } from 'next/navigation';
import { InvitesTable } from '@/components/tables/invites-table/InvitesTable';
import { openAPIClient } from '@/lib/serverFetch';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Invites'
};

export default async function DashboardAdminInvitesPage() {
	const { data, error, response } = await openAPIClient.GET('/api/v1/invites');

	if (response.status === 401) {
		redirect('/login');
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div className="px-2 w-full">
			<InvitesTable data={data.results} />
		</div>
	);
}
