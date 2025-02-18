import type { Metadata } from 'next';

import type { PageQuery } from '@/types';
import { DashboardHeader } from '@/components/DashboardHeader';
import { AlbumSettingsDialog } from '@/components/dialogs/AlbumSettingsDialog';
import { CreateAlbumDialog } from '@/components/dialogs/CreateAlbumDialog';
import { Suspense } from 'react';
import { AlbumPage } from './AlbumPage';

export const metadata: Metadata = {
	title: 'Dashboard - Albums'
};

export default async function AlbumsPage({ searchParams }: { readonly searchParams: PageQuery }) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	return (
		<>
			<DashboardHeader title="Albums" subtitle="Manage and create albums">
				<CreateAlbumDialog />
			</DashboardHeader>
			<div className="grid gap-8 w-full px-2">
				<Suspense fallback="Loading...">
					<AlbumPage page={currentPage} limit={perPage} search={search} />
				</Suspense>
			</div>
			<AlbumSettingsDialog />
		</>
	);
}
