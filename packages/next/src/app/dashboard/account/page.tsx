import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ChangePassword } from '@/components/ChangePassword';
import { RegenerateApiKey } from '@/components/RegenerateApiKey';
import { formatBytes } from '@/lib/file';
import { CategoryBar } from '@/components/Statistics';
import { redirect } from 'next/navigation';
import { openAPIClient } from '@/lib/serverFetch';

export const metadata: Metadata = {
	title: 'Dashboard - Credentials'
};

export default async function DashboardPage() {
	const { data, error, response } = await openAPIClient.GET('/api/v1/users/me');

	if (response.status === 401) {
		redirect('/login');
	}

	if (error) {
		return null;
	}

	return (
		<>
			<DashboardHeader
				title="Credentials"
				subtitle="Manage your credentials"
				breadcrumbs={[{ name: 'Credentials', url: '/dashboard/account' }]}
			/>
			<div className="px-2 w-full">
				<div className="flex flex-col lg:flex-row gap-8">
					<div className="flex flex-col gap-2 lg:w-2/4">
						<div className="flex flex-col gap-1">
							<Label htmlFor="username">Your username</Label>
							<Input name="username" id="username" value={data.username} readOnly />
							<p className="text-[0.8rem] text-muted-foreground">
								Can't be changed, only for display purposes
							</p>
						</div>

						<Separator className="my-4" />

						<ChangePassword />
					</div>
					<div className="flex flex-col w-full">
						<RegenerateApiKey apiKey={data.apiKey ?? ''} />
						<Separator className="my-4" />
						{data.storageQuota ? (
							<>
								<span className="text-light-100">Storage quota</span>
								<span className="text-light-100 flex flex-col gap-2">
									<CategoryBar
										values={[40, 30, 20, 10]}
										colors={['emerald', 'yellow', 'orange', 'rose']}
										markerValue={
											data.storageQuota ? (data.storageQuotaUsed / data.storageQuota) * 100 : 0
										}
									/>
									<p className="text-[0.8rem] text-muted-foreground">
										Using {formatBytes(data.storageQuotaUsed)} of{' '}
										{data.storageQuota === -1 ? 'unlimited' : formatBytes(data.storageQuota)}
									</p>
								</span>
							</>
						) : null}
					</div>
				</div>
			</div>
		</>
	);
}
