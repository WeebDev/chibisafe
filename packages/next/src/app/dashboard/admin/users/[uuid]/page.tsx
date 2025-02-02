import type { Metadata } from 'next';
import type { PageQuery } from '@/types';

import { DashboardHeader } from '@/components/DashboardHeader';
import { redirect } from 'next/navigation';
import { Pagination } from '@/components/Pagination';
import { FilesWrapper } from '@/components/FilesWrapper';
import { FileDialog } from '@/components/dialogs/FileDialog';
import { openAPIClient } from '@/lib/serverFetch';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Users - User'
};

export default async function DashboardAdminUserPage({
	params,
	searchParams
}: {
	readonly params: { uuid: string };
	readonly searchParams: PageQuery;
}) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const { data, error, response } = await openAPIClient.GET('/api/v1/users/{uuid}/files', {
		params: {
			path: {
				uuid: params.uuid
			},
			query: {
				offset: currentPage - 1,
				limit: perPage,
				search
			}
		}
	});

	if (response.status === 401) {
		redirect('/login');
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	const username = data.user?.username;
	return (
		<>
			<DashboardHeader
				title={`${username}'s files`}
				subtitle="As an admin, you can manage their files"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Users', url: '/dashboard/admin/users' },
					{ name: username, url: `/dashboard/admin/users/${params.uuid}` }
				]}
			/>
			<div className="px-2 w-full">
				<div className="grid gap-4">
					<Pagination itemsTotal={data.count} type="admin" />
					<FilesWrapper files={data.results} total={data.count} type="admin" />
					<Pagination itemsTotal={data.count} type="admin" />
					<FileDialog />
				</div>
			</div>
		</>
	);
}
