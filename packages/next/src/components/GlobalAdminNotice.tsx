'use client';

import { currentUserAtom } from '@/lib/atoms/currentUser';
import { settingsAtom } from '@/lib/atoms/settings';
import { useAtomValue } from 'jotai';
import Link from 'next/link';

export const GlobalAdminNotice = () => {
	const settings = useAtomValue(settingsAtom);
	const currentUser = useAtomValue(currentUserAtom);

	if (
		currentUser?.permissions.canManageSettings &&
		(!settings?.siteUrl.value || settings.siteUrl.value === 'https://your-domain.com')
	) {
		return (
			<div className="bg-yellow-700 text-white p-2 text-center text-sm">
				Files and thumbnails will be broken until you add your full domain in{' '}
				<Link href="/dashboard/admin/settings" className="underline">
					Settings {'>'} Service {'>'} Site Url
				</Link>
			</div>
		);
	}

	return null;
};
