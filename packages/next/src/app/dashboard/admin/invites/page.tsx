import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import { redirect } from 'next/navigation';
import { InvitesTable } from '@/components/tables/invites-table/InvitesTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { createInvite } from '@/actions/InviteActions';
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
		<>
			<DashboardHeader
				title="Invites"
				subtitle="Manage and create new invites"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Invites', url: '/dashboard/admin/invites' }
				]}
			>
				<form action={createInvite}>
					<Button type="submit">
						<Plus className="mr-2 h-4 w-4" />
						Create new invite
					</Button>
				</form>
			</DashboardHeader>
			<div className="px-2 w-full">
				<InvitesTable data={data.results} />
			</div>
		</>
	);
}
