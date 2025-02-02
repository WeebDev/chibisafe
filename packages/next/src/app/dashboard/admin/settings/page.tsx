import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SettingsForm } from '@/components/forms/SettingsForm';
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
		<div className="px-2 w-full">
			<SettingsForm settings={data} />
		</div>
	);
}
