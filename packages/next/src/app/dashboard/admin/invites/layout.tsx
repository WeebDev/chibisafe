import { createInvite } from '@/actions/InviteActions';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { PropsWithChildren } from 'react';

export default function InvitesLayout({ children }: PropsWithChildren) {
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
			{children}
		</>
	);
}
