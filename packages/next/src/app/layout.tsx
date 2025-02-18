import '@/styles/globals.css';

import type { PropsWithChildren } from 'react';
import type { Viewport } from 'next';
import { cookies } from 'next/headers';
import { Toaster } from 'sonner';

import { fontHeading, fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { SettingsProvider } from '@/components/providers/SettingsProvider';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { UserProvider } from '@/components/providers/UserProvider';

import { Providers } from './providers';
import { GlobalBackground } from '@/components/GlobalBackground';
import { GlobalAdminNotice } from '@/components/GlobalAdminNotice';
import { openAPIClient } from '@/lib/serverFetch';

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	minimumScale: 1,
	maximumScale: 1,
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: 'black' },
		{ media: '(prefers-color-scheme: dark)', color: 'black' }
	]
};

export async function generateMetadata() {
	const { data } = await openAPIClient.GET('/api/v1/settings');
	if (!data) return {};

	return {
		metadataBase: new URL(data.siteUrl.value),
		title: {
			default: data.siteName.value,
			template: `%s - ${data.siteName.value}`
		},
		description: data.siteDescription.value,
		keywords: data.siteKeywords.value,
		authors: [
			{
				name: 'Pitu',
				url: 'https://kana.dev'
			}
		],
		creator: 'Pitu',

		openGraph: {
			type: 'website',
			locale: 'en_US',
			url: data.siteUrl.value,
			title: data.siteName.value,
			description: data.siteDescription.value,
			siteName: data.siteName.value,
			images: [`/og`]
		},
		twitter: {
			card: 'summary_large_image',
			title: data.siteName.value,
			description: data.siteDescription.value,
			images: [`/og`],
			creator: data.siteAuthor.value
		},
		icons: {
			icon: '/favicon.ico',
			shortcut: '/favicon-16x16.png',
			apple: '/apple-touch-icon.png'
		},
		manifest: `/site.webmanifest`
	};
}

export default function RootLayout({ children }: PropsWithChildren<{}>) {
	const hasTokenCookie = cookies().has('token');

	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={cn(
					'min-h-screen bg-background font-sans antialiased',
					fontSans.variable,
					fontHeading.variable
				)}
			>
				<Providers>
					<GlobalAdminNotice />
					{children}
					<GlobalBackground />
					<Toaster position="bottom-center" />
					<TailwindIndicator />
					<UserProvider shouldFetch={hasTokenCookie} />
					<SettingsProvider />
				</Providers>
			</body>
		</html>
	);
}
