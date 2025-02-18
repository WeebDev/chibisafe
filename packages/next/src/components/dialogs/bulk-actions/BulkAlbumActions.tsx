'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { FancyMultiSelect } from '@/components/FancyMultiSelect';
import { Skeleton } from '@/components/ui/skeleton';
import { customRevalidateTag } from '@/actions/Revalidate';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ENV } from '@/util/env';
import type { FileWithFileMetadataAndIndex } from '@/lib/atoms/fileDialog';
import { openAPIClient } from '@/lib/clientFetch';
import type { FolderWithFilesCountAndCoverImage } from '@/lib/atoms/albumSettingsDialog';

interface PartialAlbum {
	name: string;
	uuid: string;
}

interface FileWithAlbums {
	albums?: PartialAlbum[];
	uuid: string;
}

export const BulkAlbumActions = ({
	files,
	isDrawer = false
}: {
	readonly files: FileWithFileMetadataAndIndex[];
	readonly isDrawer?: boolean | undefined;
}) => {
	const [open, setOpen] = useState(false);
	const [ready, setReady] = useState(false);
	const [isDirty, setIsDirty] = useState(false);

	const [allFiles, setAllFiles] = useState<FileWithAlbums[]>([]);
	const [allFilesOriginal, setAllFilesOriginal] = useState<FileWithAlbums[]>([]);

	const [allAlbums, setAllAlbums] = useState<FolderWithFilesCountAndCoverImage[]>([]);
	const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);

	const [addedAlbums, setAddedAlbums] = useState<Record<string, string[]>>({});
	const [removedAlbums, setRemovedAlbums] = useState<Record<string, string[]>>({});

	const fetchAllAlbums = useCallback(async () => {
		try {
			const { data, error } = await openAPIClient.GET('/api/v1/folders', {
				params: {
					query: {
						limit: 9999
					}
				}
			});

			if (error) {
				toast.error(error.message);
				return;
			}

			setAllAlbums(data.results);
		} catch (error) {
			console.error(error);
		}
	}, []);

	const getUsedAlbums = useCallback(async () => {
		try {
			const { data, error } = await openAPIClient.POST('/api/v1/bulk-files-folders', {
				body: {
					uuids: files.map(file => file.uuid)
				}
			});

			if (error) {
				toast.error(error.message);
				return;
			}

			setAllFiles(data);
			setAllFilesOriginal(data);

			// Flatten the album list from all files
			const allDbAlbums = data.flatMap(file => file.folders);

			// Filter unique albums based on UUID
			const uniqueAlbums = Array.from(new Set(allDbAlbums.map(album => album.uuid)));

			setSelectedAlbums(uniqueAlbums);
		} catch (error) {
			console.error(error);
		}
	}, [files]);

	const handleAddAlbum = useCallback(
		(albumUuid: string) => {
			setAllFiles(prev => {
				const newFiles = prev.map(file => {
					if (file.albums?.some(album => album.uuid === albumUuid)) {
						return file;
					}

					const albumToAdd = allAlbums.find(el => el.uuid === albumUuid)!;
					return {
						...file,
						albums: [...(file.albums ?? []), { uuid: albumToAdd.uuid, name: albumToAdd.name }]
					};
				});

				setSelectedAlbums(prev => [...prev, albumUuid]);
				setIsDirty(true);

				return newFiles;
			});
		},
		[allAlbums]
	);

	const handleRemoveAlbum = useCallback((albumUuid: string) => {
		setAllFiles(prev => {
			return prev.map(file => {
				if (!file.albums?.some(album => album.uuid === albumUuid)) {
					return file;
				}

				const updatedAlbums = file.albums?.filter(album => album.uuid !== albumUuid);

				setSelectedAlbums(prev => prev.filter(uuid => uuid !== albumUuid));
				setIsDirty(true);

				return {
					...file,
					albums: updatedAlbums
				};
			});
		});
	}, []);

	const compareChanges = useCallback(() => {
		const added = {} as any;
		const removed = {} as any;

		for (const file of allFiles) {
			const originalFile = allFilesOriginal.find(f => f.uuid === file.uuid);

			if (!originalFile) {
				continue;
			}

			const originalAlbums = originalFile.albums?.map(album => album.uuid) ?? [];
			const currentAlbums = file.albums?.map(album => album.uuid) ?? [];

			// Find albums that were added
			for (const albumUuid of currentAlbums) {
				if (!originalAlbums.includes(albumUuid)) {
					if (!added[albumUuid]) {
						added[albumUuid] = [];
					}

					added[albumUuid].push(file.uuid);
				}
			}

			// Find albums that were removed
			for (const albumUuid of originalAlbums) {
				if (!currentAlbums.includes(albumUuid)) {
					if (!removed[albumUuid]) {
						removed[albumUuid] = [];
					}

					removed[albumUuid].push(file.uuid);
				}
			}
		}

		setAddedAlbums(added);
		setRemovedAlbums(removed);
	}, [allFiles, allFilesOriginal]);

	const saveChanges = useCallback(async () => {
		compareChanges();

		if (Object.keys(addedAlbums).length > 0) {
			try {
				const { error } = await openAPIClient.POST('/api/v1/bulk-add-to-folders', {
					body: {
						folderUuids: Object.keys(addedAlbums),
						fileUuids: Object.values(addedAlbums).flat()
					}
				});

				if (error) {
					toast.error(error.message);
					return;
				}

				customRevalidateTag('albums');
				customRevalidateTag('files');
			} catch (error: any) {
				toast.error(error);
			}
		}

		if (Object.keys(removedAlbums).length > 0) {
			try {
				const { error } = await openAPIClient.POST('/api/v1/bulk-delete-from-folders', {
					body: {
						folderUuids: Object.keys(removedAlbums),
						fileUuids: Object.values(removedAlbums).flat()
					}
				});

				if (error) {
					toast.error(error.message);
					return;
				}

				customRevalidateTag('albums');
				customRevalidateTag('files');
			} catch (error: any) {
				toast.error(error);
			}
		}

		toast.success('Changes saved successfully');
		setOpen(false);
	}, [addedAlbums, compareChanges, removedAlbums]);

	useEffect(() => {
		if (open) {
			(async () => {
				await fetchAllAlbums();
				await getUsedAlbums();
				setReady(true);
				setIsDirty(true);
			})();
		}

		return () => {
			setReady(false);
			setIsDirty(false);
			setAllFiles([]);
			setAllFilesOriginal([]);
			setAllAlbums([]);
			setSelectedAlbums([]);
			setAddedAlbums({});
			setRemovedAlbums({});
		};
	}, [open, fetchAllAlbums, getUsedAlbums]);

	useEffect(() => {
		compareChanges();
	}, [allFiles, compareChanges]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{isDrawer ? (
					<Button variant="destructive" className="w-full">
						Manage albums
					</Button>
				) : (
					<button type="button" className="w-full h-full flex px-2 py-1.5 cursor-default">
						Manage albums
					</button>
				)}
			</DialogTrigger>
			<DialogContent className="w-11/12">
				<DialogHeader>
					<DialogTitle>Manage albums</DialogTitle>
					<DialogDescription>
						Use the dropdown below to manage the albums from all the selected files.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4">
					{ready ? (
						<>
							{isDirty ? (
								<div className="text-sm text-muted-foreground flex flex-col gap-2">
									<ScrollArea className="max-h-96 flex flex-col gap-2">
										<ul>
											{Object.keys(addedAlbums).length
												? Object.entries(addedAlbums).map(([albumUuid, fileUuids]) => (
														<li key={albumUuid} className="flex flex-col gap-2 mb-2">
															<p>
																{fileUuids.length} files will be added to the album{' '}
																<span className="font-bold">
																	{allAlbums.find(el => el.uuid === albumUuid)?.name}
																</span>
															</p>
															<ul className="text-green-700">
																{fileUuids.map(fileUuid => (
																	<li key={fileUuid}>
																		<a
																			href={`${ENV.BASE_API_URL}/${
																				files.find(
																					file => file.uuid === fileUuid
																				)?.filename
																			}`}
																			target="_blank"
																			rel="noreferrer noopener"
																		>
																			{
																				files.find(
																					file => file.uuid === fileUuid
																				)?.filename
																			}
																		</a>
																	</li>
																))}
															</ul>
														</li>
													))
												: null}
										</ul>
										<ul>
											{Object.keys(removedAlbums).length
												? Object.entries(removedAlbums).map(([albumUuid, fileUuids]) => (
														<li key={albumUuid} className="flex flex-col gap-2 mb-2">
															<p>
																{fileUuids.length} files will be removed from the album{' '}
																<span className="font-bold">
																	{allAlbums.find(el => el.uuid === albumUuid)?.name}
																</span>
															</p>
															<ul className="text-red-700">
																{fileUuids.map(fileUuid => (
																	<li key={fileUuid}>
																		<a
																			href={`${ENV.BASE_API_URL}/${
																				files.find(
																					file => file.uuid === fileUuid
																				)?.filename
																			}`}
																			target="_blank"
																			rel="noreferrer noopener"
																		>
																			{
																				files.find(
																					file => file.uuid === fileUuid
																				)?.filename
																			}
																		</a>
																	</li>
																))}
															</ul>
														</li>
													))
												: null}
										</ul>
									</ScrollArea>
								</div>
							) : null}

							<FancyMultiSelect
								placeholder="Select album..."
								options={allAlbums.map(album => ({
									value: album.uuid,
									label: album.name
								}))}
								initialSelected={selectedAlbums}
								onSelected={async value => handleAddAlbum(value)}
								onRemoved={async value => handleRemoveAlbum(value)}
							/>
						</>
					) : (
						<Skeleton className="w-full h-10" />
					)}
				</div>
				<DialogFooter>
					<Button type="button" variant="secondary" onClick={() => setOpen(false)}>
						Close
					</Button>
					<Button type="button" variant="default" onClick={() => void saveChanges()}>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
