/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable promise/prefer-await-to-callbacks */
'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { currentUserAtom } from '@/lib/atoms/currentUser';
import { logout } from '@/lib/logout';
import { toast } from 'sonner';
import { openAPIClient } from '@/lib/clientFetch';

export function UserProvider({ shouldFetch = false }: { readonly shouldFetch?: boolean }) {
	const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

	useEffect(() => {
		if (!currentUser && shouldFetch) {
			openAPIClient
				.GET('/api/v1/users/me')
				.then(async ({ data, error, response }) => {
					if (response.status === 401) {
						await logout();
					}

					if (error) {
						toast.error(error.message);
						return;
					}

					setCurrentUser(data);
				})
				.catch((error: any) => {
					toast.error(error);
				});
		}
	}, [currentUser, setCurrentUser, shouldFetch]);

	return null;
}
