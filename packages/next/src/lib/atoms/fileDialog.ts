import { atom } from 'jotai';
import type { FilePropsType } from '@/types';
import type { components } from '@/util/openapiSchema';

export type FileWithFileMetadata = components['schemas']['File'] & {
	fileMetadata: components['schemas']['FileMetadata'] | null;
	isOwner?: boolean;
};

export type FileWithFileMetadataAndIndex = FileWithFileMetadata & {
	index: number;
	// TODO: Remove this once the API implements quarantine
	quarantine?: any;
};

export const isDialogOpenAtom = atom(false);
export const selectedFileAtom = atom<FileWithFileMetadataAndIndex | null>(null);
export const currentTypeAtom = atom<FilePropsType | null>(null);
export const allFilesAtom = atom<FileWithFileMetadataAndIndex[]>([]);
