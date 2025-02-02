import type { Metadata } from 'next';

import type { PageQuery } from '@/types';
import { AlbumSettingsDialog } from '@/components/dialogs/AlbumSettingsDialog';
import { AlbumPage } from './AlbumPage';

export const metadata: Metadata = {
	title: 'Dashboard - Albums'
};

export default async function AlbumsPage({ searchParams }: { readonly searchParams: PageQuery }) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	return (
		<div className="grid gap-8 w-full px-2">
			<AlbumPage page={currentPage} limit={perPage} search={search} />
			<AlbumSettingsDialog />
		</div>
	);
}
