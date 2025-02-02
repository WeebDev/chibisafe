import { DashboardHeader } from '@/components/DashboardHeader';
import { CreateRoleDialog } from '@/components/dialogs/roles/CreateRoleDialog';
import type { PropsWithChildren } from 'react';

export default async function RolesLayout({ children }: PropsWithChildren) {
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
			{children}
		</>
	);
}
