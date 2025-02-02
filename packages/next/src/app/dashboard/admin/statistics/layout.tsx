import { DashboardHeader } from '@/components/DashboardHeader';
import type { PropsWithChildren } from 'react';

export default function StatisticsLayout({ children }: PropsWithChildren) {
	return (
		<>
			<DashboardHeader
				title="Statistics"
				subtitle="Your chibisafe instance stats"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Statistics', url: '/dashboard/admin/statistics' }
				]}
			/>
			{children}
		</>
	);
}
