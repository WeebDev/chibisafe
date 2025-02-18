/* eslint-disable @next/next/no-img-element */
'use client';

import type { PropsWithChildren } from 'react';
import { useCallback, useEffect, useRef, useMemo } from 'react';
import type { FilePropsType } from '@/types';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useSearchParams } from 'next/navigation';
import type { FileWithFileMetadata } from '@/lib/atoms/fileDialog';
import { currentTypeAtom, allFilesAtom } from '@/lib/atoms/fileDialog';
import { useUploadsQuery } from '@/hooks/useUploadsQuery';
import { FilesTable } from './tables/files-table/FilesTable';
import { isMasonryViewAtom } from '@/lib/atoms/settings';
import { Button } from './ui/button';
import { Masonry } from './Masonry';
import { cn } from '@/lib/utils';
import { selectedFilesAtom, selectionActiveAtom } from '@/lib/atoms/selectedFiles';
import { Pencil } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from './ui/dropdown-menu';
import { BulkAlbumActions } from './dialogs/bulk-actions/BulkAlbumActions';
import { BulkDeleteFilesAction } from './dialogs/bulk-actions/BulkDeleteFilesAction';
import { BulkRegenerateThumbnailsAction } from './dialogs/bulk-actions/BulkRegenerateThumbnailsAction';
import { BulkUnquarantineFilesAction } from './dialogs/bulk-actions/BulkUnquarantineFilesAction';
import { BulkQuarantineFilesAction } from './dialogs/bulk-actions/BulkQuarantineFilesAction';
import { BulkCompareAction } from './dialogs/bulk-actions/BulkCompareAction';
function SelectionActions({ children, type }: PropsWithChildren<{ readonly type: FilePropsType }>) {
	const selectedFiles = useAtomValue(selectedFilesAtom);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 z-[42]">
				<DropdownMenuGroup>
					<DropdownMenuItem className="p-0" onSelect={e => e.preventDefault()}>
						<BulkAlbumActions files={selectedFiles} />
					</DropdownMenuItem>
					<DropdownMenuItem className="p-0" onSelect={e => e.preventDefault()}>
						<BulkRegenerateThumbnailsAction uuids={selectedFiles.map(file => file.uuid)} />
					</DropdownMenuItem>
					<DropdownMenuItem className="p-0" onSelect={e => e.preventDefault()}>
						<BulkCompareAction files={selectedFiles} />
					</DropdownMenuItem>
					{type === 'admin' ? (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="focus:text-destructive-foreground focus:bg-destructive p-0"
								onSelect={e => e.preventDefault()}
							>
								<BulkQuarantineFilesAction uuids={selectedFiles.map(file => file.uuid)} />
							</DropdownMenuItem>
						</>
					) : null}
					{type === 'quarantine' ? (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="focus:text-destructive-foreground focus:bg-destructive p-0"
								onSelect={e => e.preventDefault()}
							>
								<BulkUnquarantineFilesAction uuids={selectedFiles.map(file => file.uuid)} />
							</DropdownMenuItem>
						</>
					) : null}
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="focus:text-destructive-foreground focus:bg-destructive p-0"
						onSelect={e => e.preventDefault()}
					>
						<BulkDeleteFilesAction uuids={selectedFiles.map(file => file.uuid)} type={type} />
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function SelectionWrapper({ selectAllFiles, type }: { selectAllFiles(): void; readonly type: FilePropsType }) {
	const [selectedFiles, setSelectedFiles] = useAtom(selectedFilesAtom);

	return (
		<div
			className={cn(
				'min-h-20 md:py-0 py-4 items-center fixed -bottom-20 z-[41] transition-transform duration-200 inset-x-4 bg-card rounded-lg shadow-xl border md:w-1/2 md:translate-x-1/2 px-4 md:px-8',
				[selectedFiles.length ? '-translate-y-32 flex' : 'translate-y-0 hidden']
			)}
		>
			<div className="h-full flex-row flex-grow justify-between hidden md:flex">
				<div className="flex flex-row items-center gap-2">
					<Button onClick={() => setSelectedFiles([])} variant="outline" className="text-sm font-medium">
						Reset selection
					</Button>
					<Button onClick={() => selectAllFiles()} variant="outline" className="text-sm font-medium">
						Select all
					</Button>
				</div>

				{selectedFiles.length ? (
					<div className="flex flex-row items-center md:gap-4">
						<span>{selectedFiles.length} selected</span>
						<SelectionActions type={type}>
							<Button size="sm" className="text-sm font-medium">
								Actions
							</Button>
						</SelectionActions>
					</div>
				) : null}
			</div>
			<div className="h-full flex-row flex-grow  md:hidden flex gap-4 justify-between">
				<div className="flex flex-row items-center">
					<SelectionActions type={type}>
						<Button size="sm" className="text-sm font-medium gap-1 items-center tabular-nums">
							{selectedFiles.length} selected <Pencil className="h-4 w-4" />
						</Button>
					</SelectionActions>
				</div>

				<div className="flex flex-row items-center justify-end gap-2">
					<Button onClick={() => setSelectedFiles([])} variant="outline" className="text-sm font-medium">
						Reset
					</Button>
					<Button onClick={() => selectAllFiles()} variant="outline" className="text-sm font-medium">
						Select all
					</Button>
				</div>
			</div>
		</div>
	);
}

export function FilesWrapper({
	files,
	total,
	type,
	albumUuid
}: {
	readonly albumUuid?: string | undefined;
	readonly files?: FileWithFileMetadata[] | undefined;
	readonly total?: number | undefined;
	readonly type: FilePropsType;
}) {
	const isUploads = type === 'uploads';
	const isAlbumUploads = type === 'album' && Boolean(albumUuid);
	const container = useRef<HTMLDivElement>(null);
	// const bulkActionsContainer = useRef<HTMLDivElement>(null);

	const searchParams = useSearchParams();
	const currentPage = searchParams.get('page') ? Number.parseInt(searchParams.get('page')!, 10) : 1;
	const perPage = searchParams.get('limit')
		? Number.parseInt(searchParams.get('limit')!, 10) > 50
			? 50
			: Number.parseInt(searchParams.get('limit')!, 10)
		: 50;
	const search = searchParams.get('search') ?? '';

	const { data } = useUploadsQuery({ currentPage, perPage, search, type, albumUuid });

	const setAllFilesAtom = useSetAtom(allFilesAtom);
	const setCurrentType = useSetAtom(currentTypeAtom);
	const showMasonry = useAtomValue(isMasonryViewAtom);

	const filesToUse = useMemo(() => {
		return (files?.length ? files : isUploads || isAlbumUploads ? data?.results ?? [] : []).map((file, index) => ({
			...file,
			index
		}));
	}, [files, data, isUploads, isAlbumUploads]);

	const setSelectedFiles = useSetAtom(selectedFilesAtom);
	const [isSelectionActive, setIsSelectionActive] = useAtom(selectionActiveAtom);

	useEffect(() => {
		setCurrentType(type);
		setAllFilesAtom(filesToUse);

		return () => {
			setSelectedFiles([]);
		};
	}, [filesToUse, setAllFilesAtom, setCurrentType, setSelectedFiles, type]);

	const selectAllFiles = useCallback(() => {
		setSelectedFiles(filesToUse);
	}, [filesToUse, setSelectedFiles]);

	return (
		<>
			<Button
				onClick={() =>
					setIsSelectionActive(value => {
						if (value) {
							setSelectedFiles([]);
						}

						return !value;
					})
				}
				variant="outline"
				className="flex md:hidden"
			>
				{isSelectionActive ? 'Turn off bulk actions' : 'Bulk actions'}
			</Button>
			<div className="flex flex-col w-full h-full gap-4 relative" ref={container}>
				{showMasonry ? (
					<Masonry files={filesToUse} type={type} />
				) : (
					<FilesTable data={files?.length ? files : data?.results ?? []} type={type} />
				)}
			</div>
			<SelectionWrapper selectAllFiles={selectAllFiles} type={type} />
		</>
	);
}
