'use client';

import { useSetAtom } from 'jotai';

import { settingsAtom } from '@/lib/atoms/settings';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { openAPIClient } from '@/lib/clientFetch';

export function SettingsProvider() {
	const setSettings = useSetAtom(settingsAtom);

	useQuery({
		queryKey: ['settings'],
		queryFn: async () => {
			const { data, error, response } = await openAPIClient.GET('/api/v1/settings');

			if (error && response.status === 401) {
				toast.error(error.message);
				return;
			}

			setSettings(data ?? null);
			return data;
		}
	});

	return null;
}
