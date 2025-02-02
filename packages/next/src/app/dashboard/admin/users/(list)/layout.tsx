import { DashboardHeader } from '@/components/DashboardHeader';
import { CreateUserDialog } from '@/components/dialogs/CreateUserDialog';
import type { PropsWithChildren } from 'react';

export default async function UsersLayout({ children }: PropsWithChildren) {
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
			{children}
		</>
	);
}
