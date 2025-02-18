import type { components } from '@/util/openapiSchema';

export type TagWithFilesCountAndCoverImage = components['schemas']['Tag'] & {
	coverImage: (components['schemas']['File'] & { fileMetadata: components['schemas']['FileMetadata'] | null }) | null;
	filesCount: number;
	nearestParent: Omit<components['schemas']['Tag'], 'createdAt' | 'editedAt'> | null;
};
