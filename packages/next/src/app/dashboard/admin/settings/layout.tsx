import { DashboardHeader } from '@/components/DashboardHeader';
import { DiagnosticsDownloadButton } from '@/components/DiagnosticsDownloadButton';
import type { PropsWithChildren } from 'react';

export default async function SettingsLayout({ children }: PropsWithChildren) {
	return (
		<>
			<DashboardHeader
				title="Settings"
				subtitle="Manage all your chibisafe settings here"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Settings', url: '/dashboard/admin/settings' }
				]}
			>
				<DiagnosticsDownloadButton />
			</DashboardHeader>
			{children}
		</>
	);
}
