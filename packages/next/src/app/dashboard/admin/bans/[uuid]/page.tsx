import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import type { PageQuery } from '@/types';
import { Suspense } from 'react';
import { Pagination } from '@/components/Pagination';
import { FilesWrapper } from '@/components/FilesWrapper';
import { FileDialog } from '@/components/dialogs/FileDialog';
import { openAPIClient } from '@/lib/serverFetch';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - IPs'
};

export default async function DashboardPage({
	params,
	searchParams
}: {
	readonly params: { uuid: string };
	readonly searchParams: PageQuery;
}) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const {
		data: ipData,
		error,
		response
	} = await openAPIClient.GET('/api/v1/ip-bans/{uuid}', {
		params: {
			path: {
				uuid: params.uuid
			}
		}
	});

	if (response.status === 401) {
		redirect('/login');
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	const { data, error: filesError } = await openAPIClient.GET('/api/v1/ip-bans/{uuid}/files', {
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

	if (filesError) {
		return <div>Error: {filesError.message}</div>;
	}

	return (
		<>
			<DashboardHeader
				title={`${ipData.ip} files`}
				subtitle="As an admin, you can manage their files"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Banned IPs', url: '/dashboard/admin/ip' },
					{ name: ipData.ip, url: `/dashboard/admin/ip/${ipData.ip}` }
				]}
			/>
			<div className="px-2 w-full">
				<div className="grid gap-4">
					<Suspense>
						<Pagination itemsTotal={data.count} type="admin" />
						<FilesWrapper files={data.results} total={data.count} type="admin" />
						<Pagination itemsTotal={data.count} type="admin" />
					</Suspense>
					<FileDialog />
				</div>
			</div>
		</>
	);
}
