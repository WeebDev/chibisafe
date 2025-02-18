'use client';

import type { Settings } from '@/types';
import type { DropItem, FileDropItem } from 'react-aria-components';
import { isDirectoryDropItem, isFileDropItem } from 'react-aria-components';
import { getFileExtension } from './file';

export const processDropItem = async (item: DropItem | File, settings: Settings | null) => {
	if (item instanceof File) {
		if (settings?.blockedExtensions.length) {
			const extension = getFileExtension(item.name);
			if (!extension) return [];
			if (settings?.blockedExtensions.includes(`.${extension}`)) {
				return [];
			}
		}

		return [item];
	}

	if (isFileDropItem(item)) {
		if (settings?.blockedExtensions.length) {
			const extension = getFileExtension(item.name);
			if (!extension) return [];
			if (settings?.blockedExtensions.includes(`.${extension}`)) {
				return [];
			}
		}

		return [item];
	} else if (isDirectoryDropItem(item)) {
		const dir = item.getEntries();
		const items: (File | FileDropItem)[] = [];
		for await (const entry of dir) {
			const item = await processDropItem(entry, settings);
			items.push(...item);
		}

		return items;
	}

	return [];
};

export const getSignedUrl = async (file: File) => {
	const response = await fetch('/api/upload', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			credentials: 'include'
		},
		body: JSON.stringify({
			contentType: file.type,
			name: file.name,
			size: file.size
		})
	});

	if (!response.ok) {
		const error = await response.json();
		return { error: error.message };
	}

	const { url, identifier, publicUrl } = await response.json();
	return { url, identifier, publicUrl };
};
