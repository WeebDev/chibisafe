import type { components } from '@/util/openapiSchema';
import { atom } from 'jotai';

export type FolderWithFilesCountAndCoverImage = components['schemas']['Folder'] & {
	coverImage: (components['schemas']['File'] & { fileMetadata: components['schemas']['FileMetadata'] | null }) | null;
	filesCount: number;
	isOwner: boolean;
};

export const isDialogOpenAtom = atom(false);
export const selectedAlbumAtom = atom<FolderWithFilesCountAndCoverImage | null>(null);
