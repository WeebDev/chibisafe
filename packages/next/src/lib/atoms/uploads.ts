import { atom } from 'jotai';
import { atomWithImmer } from 'jotai-immer';

export const uploadsQueueAtom = atomWithImmer<
	{
		readonly albumUuid?: string;
		readonly error?: string;
		readonly finished: boolean;
		readonly name: string;
		readonly percentComplete: number;
		readonly uploadSpeed: number;
		readonly url: string;
		readonly uuid: string;
	}[]
>([]);

export const uploadsAtom = atom(get => get(uploadsQueueAtom));

export const finishedUploadsAtom = atom(get => get(uploadsQueueAtom).filter(upload => upload.finished));

export const unfinishedUploadsAtom = atom(get => get(uploadsQueueAtom).filter(upload => !upload.finished));
