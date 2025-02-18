'use client';

import { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useSetAtom } from 'jotai';

import type { FolderWithFilesCountAndCoverImage } from '@/lib/atoms/albumSettingsDialog';
import { isDialogOpenAtom, selectedAlbumAtom } from '@/lib/atoms/albumSettingsDialog';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AlbumDropZone } from './AlbumDropzone';
import { albumDisablePointerEventAtom } from '@/lib/atoms/dropzone';
import { buttonVariants } from '@/styles/button';
import { ENV } from '@/util/env';

export const Album = ({ album }: { readonly album: FolderWithFilesCountAndCoverImage }) => {
	const selectedAlbum = useSetAtom(selectedAlbumAtom);
	const setIsDialogOpen = useSetAtom(isDialogOpenAtom);
	const setAlbumDisablePointerEvent = useSetAtom(albumDisablePointerEventAtom);

	const setSelectedAlbum = useCallback(
		(album: FolderWithFilesCountAndCoverImage) => {
			selectedAlbum(album);
			setIsDialogOpen(true);
		},
		[selectedAlbum, setIsDialogOpen]
	);

	useEffect(() => {
		const dragEnterHandler = (ev: DragEvent) => {
			if (ev.dataTransfer?.types.includes('Files')) {
				setAlbumDisablePointerEvent(false);
			}
		};

		window.addEventListener('dragenter', dragEnterHandler);

		return () => {
			window.removeEventListener('dragenter', dragEnterHandler);
		};
	}, [setAlbumDisablePointerEvent]);

	return (
		<div className="relative h-56 w-40 sm:h-96 sm:w-60">
			<AlbumDropZone className="hidden sm:block h-96 w-60" albumUuid={album.uuid} />
			<div className="group">
				<div
					className={cn(
						"absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-200 after:absolute after:-inset-0 after:bg-gradient-to-t after:from-[rgb(4_21_47)] after:via-[rgb(19_36_61_/_0.6)] after:via-30% after:content-[''] group-hover:scale-105 group-hover:duration-150 group-hover:outline-4 group-hover:outline-[hsl(216_77%_45%)] outline outline-transparent",
						album.isNSFW ? 'blur group-hover:blur-0' : ''
					)}
					style={{
						backgroundImage: album.coverImage
							? `url(${ENV.BASE_API_URL}/thumbnails/${album.coverImage.identifier}.webp)`
							: ''
					}}
				>
					{album.isOwner ? null : (
						<div className="absolute top-0 w-full flex items-center justify-center bg-[rgb(4_21_47)] p-1">
							Collaborator
						</div>
					)}
				</div>
				<div className="absolute bottom-0 left-4 right-4 pointer-events-none select-none group-hover:pointer-events-auto">
					<div className="max-h-40 overflow-hidden md:overflow-auto md:max-h-none mb-2 transform-gpu text-2xl font-bold text-white delay-75 duration-200 group-hover:-translate-y-14 group-hover:delay-75 cursor-pointer">
						{album.name}
					</div>
					<div className="mb-4 transform-gpu text-lg font-normal text-white delay-0 duration-200 group-hover:-translate-y-14 group-hover:delay-100">
						{album.filesCount} files
					</div>
				</div>
				<Link
					href={`/dashboard/albums/${album.uuid}`}
					className="hidden md:inline-flex absolute inset-0 transition-all cursor-pointer duration-100 group-hover:scale-105 group-hover:duration-150"
				/>

				<Link
					href={`/dashboard/albums/${album.uuid}`}
					className={cn(
						buttonVariants({ variant: 'default' }),
						'md:hidden inline-flex absolute -bottom-10 left-4 right-4 transition-all opacity-0 duration-100 group-hover:-translate-y-14 transform-gpu group-hover:opacity-100 group-hover:delay-100'
					)}
				>
					View files
				</Link>
				{album.isOwner ? (
					<Button
						className="absolute bottom-2 md:-bottom-10 left-4 right-4 transition-all opacity-0 duration-100 group-hover:-translate-y-14 transform-gpu group-hover:opacity-100 group-hover:delay-100"
						onClick={() => setSelectedAlbum(album)}
					>
						Settings
					</Button>
				) : null}
			</div>
		</div>
	);
};
