import type { components } from '@/util/openapiSchema';
import { atom } from 'jotai';

export type User = components['schemas']['RolesPermissions'] &
	Omit<components['schemas']['User'], 'createdAt' | 'editedAt'> & {
		apiKey: string | null;
	};

export const currentUserAtom = atom<User | null>(null);
