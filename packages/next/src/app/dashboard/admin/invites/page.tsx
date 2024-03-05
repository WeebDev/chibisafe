import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import request from '@/lib/request';
import { InvitesTable } from '@/components/tables/invites-table/InvitesTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
export const metadata: Metadata = {
	title: 'Dashboard - Admin - Invites'
};

export default async function DashboardPage() {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;
	if (!token) redirect('/');

	const authorization = {
		authorization: `Bearer ${token}`
	};

	const response = await request.get(`admin/invites`, {}, authorization, {
		next: {
			tags: ['invites']
		}
	});
	return (
		<>
			<DashboardHeader title="Invites" subtitle="Manage and create new invites">
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Create new invite
				</Button>
			</DashboardHeader>
			<div className="px-2">
				<InvitesTable data={response.invites} />
			</div>
		</>
	);
}
