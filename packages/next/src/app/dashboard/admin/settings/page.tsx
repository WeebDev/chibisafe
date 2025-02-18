import { DashboardHeader } from '@/components/DashboardHeader';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SettingsForm } from '@/components/forms/SettingsForm';
import { DiagnosticsDownloadButton } from '@/components/DiagnosticsDownloadButton';
import { openAPIClient } from '@/lib/serverFetch';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Settings'
};

export default async function DashboardAdminSettingsServicePage() {
	const { data, error, response } = await openAPIClient.GET('/api/v1/settings');

	if (response.status === 401) {
		redirect('/login');
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

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
			<div className="px-2 w-full">
				<SettingsForm settings={data} />
			</div>
		</>
	);
}
