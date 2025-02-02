import { DashboardHeader } from '@/components/DashboardHeader';
import type { PropsWithChildren } from 'react';

export default function FilesLayout({ children }: PropsWithChildren) {
	return (
		<>
			<DashboardHeader
				title="Everyone's files"
				subtitle="Manage all of chibisafe files, no matter who owns them."
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'All files', url: '/dashboard/admin/files' }
				]}
			/>
			{children}
		</>
	);
}
