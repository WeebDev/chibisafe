import { atom } from 'jotai';
import type { FileWithFileMetadataAndIndex } from './fileDialog';

export const selectedFilesAtom = atom<FileWithFileMetadataAndIndex[]>([]);
export const selectionActiveAtom = atom(false);
