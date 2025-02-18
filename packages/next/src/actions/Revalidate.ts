'use server';

import { revalidateTag } from 'next/cache';

export const customRevalidateTag = (tag: string) => {
	revalidateTag(tag);
};

export const customRevalidatePath = (path: string) => {
	revalidateTag(path);
};
