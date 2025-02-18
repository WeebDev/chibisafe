'use client';

import { Masonry as Plock } from '@/components/ui/plock';
import { Album } from '@/components/Album';
import type { FolderWithFilesCountAndCoverImage } from '@/lib/atoms/albumSettingsDialog';

export function AlbumMasonry({ albums = [] }: { readonly albums?: FolderWithFilesCountAndCoverImage[] | undefined }) {
	return (
		<Plock
			items={albums}
			config={{
				columns: [2, 2, 3, 4],
				gap: [10, 14, 14, 14],
				media: [640, 1024, 1400, 1400]
			}}
			className="px-1"
			render={album => <Album key={album.uuid} album={album} />}
		/>
	);
}
