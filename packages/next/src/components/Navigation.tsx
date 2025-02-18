'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { settingsAtom } from '@/lib/atoms/settings';
import { useAtomValue } from 'jotai';
import { NavigationDrawer } from './NavigationDrawer';

export function Navigation({
	logo,
	serviceName = ''
}: {
	readonly logo: ReactNode;
	readonly serviceName?: string | undefined;
}) {
	const path = usePathname();
	const settings = useAtomValue(settingsAtom);

	return (
		<div className="flex gap-6">
			<Link href="/" className="hidden items-center md:flex gap-4">
				{logo}
				<span className="hidden font-bold sm:inline-block">{settings?.siteName.value ?? serviceName}</span>
			</Link>
			<nav className="hidden gap-6 md:flex">
				<Link
					href="/dashboard"
					className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm text-foreground/60"
				>
					Dashboard
				</Link>
				<a
					href="/docs"
					rel="noopener noreferrer"
					className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm text-foreground/60"
				>
					Docs
				</a>
				<a
					href="https://chibisafe.app/docs/intro"
					rel="noopener noreferrer"
					className={cn(
						'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm text-foreground/60'
					)}
				>
					Guides
				</a>
				<Link
					href="/faq"
					className={cn(
						'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
						path === '/faq' ? 'text-foreground' : 'text-foreground/60'
					)}
				>
					FAQ
				</Link>
			</nav>
			<NavigationDrawer logo={logo} className="md:hidden flex" />
		</div>
	);
}
