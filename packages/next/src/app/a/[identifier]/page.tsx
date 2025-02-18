import type { Metadata } from 'next';
import type { MetadataBuilder, PageQuery } from '@/types';

import { DashboardHeader } from '@/components/DashboardHeader';
import { FilesListNsfwToggle } from '@/components/FilesListNsfwToggle';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Pagination } from '@/components/Pagination';
import { FilesWrapper } from '@/components/FilesWrapper';
import { FileDialog } from '@/components/dialogs/FileDialog';
import { openAPIClient } from '@/lib/serverFetch';
import { ENV } from '@/util/env';

export async function generateMetadata({ params }: { readonly params: { identifier: string } }): Promise<Metadata> {
	const { data, error } = await openAPIClient.GET('/api/v1/folders/public/{shareIdentifier}', {
		params: {
			path: {
				shareIdentifier: params.identifier
			}
		}
	});

	if (error) {
		return {};
	}

	const meta = {
		title: data.isNSFW ? `[nsfw] ${data.name}` : data.name,
		openGraph: {
			title: data.isNSFW ? `[nsfw] ${data.name}` : data.name,
			images: [data.isNSFW ? '/og?section=nsfw-album' : '/og?section=album']
		},
		twitter: {
			title: data.isNSFW ? `[nsfw] ${data.name}` : data.name,
			images: [data.isNSFW ? '/og?section=nsfw-album' : '/og?section=album']
		}
	} as MetadataBuilder;

	if (data.description) {
		meta.description = data.description;
		meta.openGraph.description = data.description;
		meta.twitter.description = data.description;
	}

	if (!data.isNSFW && data.coverImage) {
		meta.openGraph.images = [`${ENV.BASE_API_URL}/thumbnails/${data.coverImage.identifier}.webp`];
		meta.twitter.images = [`${ENV.BASE_API_URL}/thumbnails/${data.coverImage.identifier}.webp`];
	}

	return meta;
}

export default async function PublicAlbumPage({
	searchParams,
	params
}: {
	readonly params: { identifier: string };
	readonly searchParams: PageQuery;
}) {
	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const {
		data: albumData,
		error,
		response
	} = await openAPIClient.GET('/api/v1/folders/public/{shareIdentifier}', {
		params: {
			path: {
				shareIdentifier: params.identifier
			}
		}
	});

	if (response.status === 404) {
		return notFound();
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	const { data, error: filesError } = await openAPIClient.GET('/api/v1/folders/public/{shareIdentifier}/files', {
		params: {
			path: {
				shareIdentifier: params.identifier
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
			<DashboardHeader title={albumData.name} subtitle={albumData.description ?? ''} />
			<div className="px-2 w-full flex h-full flex-grow flex-col">
				<FilesListNsfwToggle nsfw={albumData.isNSFW}>
					<div className="grid gap-4">
						<Suspense>
							<Pagination itemsTotal={data.count} type="publicAlbum" />
							<FilesWrapper
								// @ts-expect-error partial type
								files={data.results}
								total={data.count}
								type="publicAlbum"
							/>
							<Pagination itemsTotal={data.count} type="publicAlbum" />
						</Suspense>
						<FileDialog />
					</div>
				</FilesListNsfwToggle>
			</div>
		</>
	);
}
