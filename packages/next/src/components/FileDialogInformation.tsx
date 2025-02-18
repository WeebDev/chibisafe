import { useCallback, useEffect, useState, type PropsWithChildren } from 'react';

import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import type { FilePropsType } from '@/types';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';
import { Input } from './ui/input';
import Link from 'next/link';
import { ArrowUpRightFromSquare, InfoIcon } from 'lucide-react';
import { formatBytes } from '@/lib/file';
import { getDate } from '@/lib/time';
import { Badge } from './ui/badge';
import { FancyMultiSelect } from './FancyMultiSelect';
import { useMediaQuery } from 'usehooks-ts';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip } from './Tooltip';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useSetAtom } from 'jotai';
import type { FileWithFileMetadataAndIndex } from '@/lib/atoms/fileDialog';
import { isDialogOpenAtom } from '@/lib/atoms/fileDialog';
import { ENV } from '@/util/env';
import { openAPIClient } from '@/lib/clientFetch';
import type { FolderWithFilesCountAndCoverImage } from '@/lib/atoms/albumSettingsDialog';
import type { TagWithFilesCountAndCoverImage } from '@/lib/atoms/tags';

const OpenButton = () => {
	return (
		<Tooltip content="Information">
			<Button size={'icon'} variant={'ghost'}>
				<InfoIcon className="h-5 w-5" />
			</Button>
		</Tooltip>
	);
};

const ComponentToRender = ({ children }: PropsWithChildren<{}>) => {
	const isMobile = useMediaQuery('(max-width: 768px)');
	return isMobile ? (
		<Drawer>
			<DrawerTrigger>
				<OpenButton />
			</DrawerTrigger>
			<DrawerContent>
				<ScrollArea className="h-svh pb-24">{children}</ScrollArea>
			</DrawerContent>
		</Drawer>
	) : (
		<Sheet>
			<SheetTrigger>
				<OpenButton />
			</SheetTrigger>
			<SheetContent>
				<ScrollArea className="p-6 md:p-8 h-full">{children}</ScrollArea>
			</SheetContent>
		</Sheet>
	);
};

type AlbumOrTag = {
	name: string;
	uuid: string;
};

export const FileDialogInformation = ({
	file,
	type
}: PropsWithChildren<{ readonly file: FileWithFileMetadataAndIndex; readonly type: FilePropsType }>) => {
	const [tags, setTags] = useState<TagWithFilesCountAndCoverImage[]>([]);
	const [fileTags, setFileTags] = useState<AlbumOrTag[]>([]);
	const [albums, setAlbums] = useState<FolderWithFilesCountAndCoverImage[]>([]);
	const [fileAlbums, setFileAlbums] = useState<AlbumOrTag[]>([]);
	const setModalOpen = useSetAtom(isDialogOpenAtom);

	const addFileToAlbum = useCallback(
		async (albumUuid: string) => {
			try {
				const { error } = await openAPIClient.POST('/api/v1/folders/{uuid}/files/bulk-add', {
					params: {
						path: {
							uuid: albumUuid
						}
					},
					body: {
						uuids: [file?.uuid]
					}
				});

				if (error) {
					toast.error(error.message);
					return;
				}

				toast.success('File added to album');
			} catch (error: any) {
				toast.error(error);
			}
		},
		[file?.uuid]
	);

	const removeFileFromAlbum = useCallback(
		async (albumUuid: string) => {
			try {
				const { error } = await openAPIClient.POST('/api/v1/folders/{uuid}/files/bulk-delete', {
					params: {
						path: {
							uuid: albumUuid
						}
					},
					body: {
						uuids: [file?.uuid]
					}
				});

				if (error) {
					toast.error(error.message);
					return;
				}

				toast.success('File removed from album');
			} catch (error) {
				console.error(error);
			}
		},
		[file?.uuid]
	);

	const addTagToFile = useCallback(
		async (tagUuid: string) => {
			try {
				const { error } = await openAPIClient.POST('/api/v1/tags/{uuid}/files/bulk-add', {
					params: {
						path: {
							uuid: tagUuid
						}
					},
					body: {
						uuids: [file?.uuid]
					}
				});

				if (error) {
					toast.error(error.message);
					return;
				}

				toast.success('Tag added to file');
			} catch (error: any) {
				toast.error(error);
			}
		},
		[file?.uuid]
	);

	const removeTagFromFile = useCallback(
		async (tagUuid: string) => {
			try {
				const { error } = await openAPIClient.POST('/api/v1/tags/{uuid}/files/bulk-delete', {
					params: {
						path: {
							uuid: tagUuid
						}
					},
					body: {
						uuids: [file?.uuid]
					}
				});

				if (error) {
					toast.error(error.message);
					return;
				}

				toast.success('Tag removed from file');
			} catch (error) {
				console.error(error);
			}
		},
		[file?.uuid]
	);

	const fetchAdditionalData = useCallback(async () => {
		try {
			if (type === 'admin') return;
			if (type === 'publicAlbum') return;
			if (type === 'quarantine') return;

			const { data: userAlbums, error: userAlbumsError } = await openAPIClient.GET('/api/v1/folders', {
				params: {
					query: {
						limit: 9999
					}
				}
			});

			if (userAlbumsError) {
				toast.error(userAlbumsError.message);
				return;
			}

			setAlbums(userAlbums.results);

			const { data: userTags, error: userTagsError } = await openAPIClient.GET('/api/v1/tags', {
				params: {
					query: {
						limit: 9999
					}
				}
			});

			if (userTagsError) {
				toast.error(userTagsError.message);
				return;
			}

			setTags(userTags.results);

			const { data: userFile, error: userFileError } = await openAPIClient.GET('/api/v1/files/{uuid}', {
				params: {
					path: {
						uuid: file?.uuid
					}
				}
			});

			if (userFileError) {
				toast.error(userFileError.message);
				return;
			}

			setFileAlbums(userFile.folders);
			setFileTags(userFile.tags);
		} catch (error) {
			console.error(error);
		}
	}, [file?.uuid, type]);

	useEffect(() => {
		if (file.isOwner) void fetchAdditionalData();
	}, [fetchAdditionalData, file.isOwner]);

	return (
		<ComponentToRender>
			<div className="flex flex-col gap-8 p-6 md:p-0">
				<input type="text" className="opacity-0 pointer-events-none select-none" />
				{type === 'admin' || type === 'quarantine' ? (
					<div className="w-full max-w-lg">
						<div className="flex flex-col gap-2">
							<h2 className="text-2xl font-semibold leading-none tracking-tight mb-4">
								User information
							</h2>

							{/* {file.user ? (
								TODO: Not implemented yet
								<>
									<div>
										<Label htmlFor="owner">
											Owner
											<Link
												href={`/dashboard/admin/users/${file.user?.uuid}`}
												className="text-blue-500 underline inline-flex items-center ml-2"
												onClick={() => setModalOpen(false)}
											>
												view files <ArrowUpRightFromSquare className="w-3 h-3 ml-1" />
											</Link>
										</Label>
										<Input value={file.user.username} name="owner" id="owner" readOnly />
									</div>

									<div>
										<Label htmlFor="userUUID">User UUID</Label>
										<Input value={file.user?.uuid} name="userUUID" id="userUUID" readOnly />
									</div>

									<div>
										<Label htmlFor="status">Status</Label>
										<Input
											value={file.user.enabled ? 'Enabled' : 'Disabled'}
											name="status"
											id="status"
											readOnly
										/>
									</div>

									<div>
										<Label htmlFor="null">Roles</Label>
										<div>
											{file.user.roles.map((role: any) => (
												<Badge key={role.name} className="mr-1">
													{role.name}
												</Badge>
											))}
										</div>
									</div>

									<div>
										<Label htmlFor="joined">Joined</Label>
										<Input
											value={getDate(file.user.createdAt.toString())}
											name="joined"
											id="joined"
											readOnly
										/>
									</div>
								</>
							) : (
								<div>
									<Label htmlFor="owner">Owner</Label>
									<Input value="No owner" name="owner" id="owner" readOnly />
								</div>
							)} */}
						</div>
					</div>
				) : file.isOwner ? (
					<div className="w-full">
						<div className="flex flex-col gap-2">
							<h2 className="text-2xl font-semibold leading-none tracking-tight mb-4">Albums</h2>
							<div>
								<Label htmlFor="albums">Add albums</Label>
								<div className="font-light text-xs px-2 my-2 border-l-2 border-blue-500">
									A file can be added to multiple albums.
								</div>
								<FancyMultiSelect
									placeholder="Select album..."
									options={albums.map(album => ({
										value: album.uuid,
										label: album.name
									}))}
									initialSelected={fileAlbums.map(album => album.uuid)}
									onSelected={async value => addFileToAlbum(value)}
									onRemoved={async value => removeFileFromAlbum(value)}
								/>
							</div>
						</div>
						<div className="flex flex-col space-y-1.5 gap-0 mt-8">
							<h2 className="text-2xl font-semibold leading-none tracking-tight mb-4">Tags</h2>
							<div>
								<Label htmlFor="tags">Attach tags</Label>
								<div className="font-light text-xs px-2 my-2 border-l-2 border-blue-500">
									To create a new tag, type the name of the tag and press enter. <br />
									This will attach it to the file automatically.
								</div>

								<FancyMultiSelect
									placeholder="Select tags..."
									options={tags.map(tag => ({
										value: tag.uuid,
										label: `${tag.name}${tag.nearestParent ? ` (${tag.nearestParent.name})` : ''}`
									}))}
									initialSelected={fileTags.map(tag => tag.uuid)}
									onSelected={async value => addTagToFile(value)}
									onRemoved={async value => removeTagFromFile(value)}
								/>
							</div>
						</div>
					</div>
				) : null}

				<div className="flex flex-col gap-2 w-full">
					<h2 className="text-2xl font-semibold leading-none tracking-tight mb-4">File information</h2>

					<div>
						<Label htmlFor="uuid">UUID</Label>
						<Input value={file.uuid} name="uuid" id="uuid" readOnly />
					</div>

					<div>
						<Label htmlFor="name">Name</Label>
						<Input value={file.filename} name="name" id="name" readOnly />
					</div>

					{type === 'admin' || file.isOwner ? (
						<div>
							<Label htmlFor="original">Original</Label>
							<Input value={file.fileMetadata?.originalFilename} name="original" id="original" readOnly />
						</div>
					) : null}

					{type === 'admin' || file.isOwner ? (
						<div>
							<Label htmlFor="ip">
								IP{' '}
								{type === 'admin' ? (
									<Link
										href={`/dashboard/admin/ip/${file.fileMetadata?.ip}`}
										className="text-blue-500 underline inline-flex items-center ml-2"
										onClick={() => setModalOpen(false)}
									>
										view files <ArrowUpRightFromSquare className="w-3 h-3 ml-1" />
									</Link>
								) : null}
							</Label>
							<Input value={file.fileMetadata?.ip ?? 'No IP'} name="ip" id="ip" readOnly />
						</div>
					) : null}

					<div>
						<Label htmlFor="url">URL</Label>
						<Input value={`${ENV.BASE_API_URL}/${file.filename}`} name="url" id="url" readOnly />
					</div>

					<div>
						<Label htmlFor="size">Size</Label>
						<Input value={formatBytes(file.fileMetadata?.size ?? 0)} name="size" id="size" readOnly />
					</div>

					<div>
						<Label htmlFor="hash">Hash</Label>
						<Input value={file.fileMetadata?.hash} name="hash" id="hash" readOnly />
					</div>

					<div>
						<Label htmlFor="uploaded">Uploaded</Label>
						<Input value={getDate(file.createdAt)} name="uploaded" id="uploaded" readOnly />
					</div>
				</div>
			</div>
		</ComponentToRender>
	);
};
