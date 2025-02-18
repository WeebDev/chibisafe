import type { components } from '@/util/openapiSchema';
import { atom } from 'jotai';

export type SettingsType = components['schemas']['Settings'];

export const settingsAtom = atom<SettingsType | null>(null);
export const isMasonryViewAtom = atom(true);
