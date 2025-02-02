import { DashboardHeader } from '@/components/DashboardHeader';
import type { PropsWithChildren } from 'react';

export default async function AccountLayout({ children }: PropsWithChildren) {
	return (
		<>
			<DashboardHeader
				title="Credentials"
				subtitle="Manage your credentials"
				breadcrumbs={[{ name: 'Credentials', url: '/dashboard/account' }]}
			/>
			{children}
		</>
	);
}
