import { DashboardHeader } from '@/components/DashboardHeader';
import type { PropsWithChildren } from 'react';

export default function QuarantineLayout({ children }: PropsWithChildren) {
	return (
		<>
			<DashboardHeader
				title="Quarantined files"
				subtitle="Manage quarantined files"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Quarantined files', url: '/dashboard/admin/quarantine' }
				]}
			/>
			{children}
		</>
	);
}
