import { cn } from '@/lib/utils';
import { ChibisafeDefaultLogo } from '@/components/svg/ChibisafeLogo';
import Link from 'next/link';
import { openAPIClient } from '@/lib/serverFetch';

export const SiteFooter = async ({ className = '' }: { readonly className?: string }) => {
	const { data } = await openAPIClient.GET('/api/v1/settings');

	return (
		<footer className={cn(className, 'bg-background-transparent')}>
			<div className="container flex flex-col place-items-center place-content-between gap-4 py-5 md:flex-row">
				<div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
					<Link href="/" aria-label="chibisafe">
						<ChibisafeDefaultLogo className="w-6 h-6" />
					</Link>
					<p className="text-center text-sm leading-loose md:text-left">
						Built by{' '}
						<a
							href="https://kana.dev"
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium underline underline-offset-4"
						>
							Pitu
						</a>
						. The source code is available on{' '}
						<a
							href="https://github.com/chibisafe/chibisafe"
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium underline underline-offset-4"
						>
							GitHub
						</a>
						. <span className="text-slate-400 text-xs">v{process.env.NEXT_PUBLIC_VERSION}</span>
					</p>
				</div>
				<div className="flex flex-col items-center gap-4 md:flex-row text-xs">
					{/* TODO: Re-enable this */}
					{/* {data?.rulesPageContent ? (
						<Link href="/rules" aria-label="rules">
							Rules
						</Link>
					) : null}
					{data?.privacyPolicyPageContent ? (
						<Link href="/privacy-policy" aria-label="privacy policy">
							Privacy policy
						</Link>
					) : null}
					{data?.termsOfServicePageContent ? (
						<Link href="/terms-of-service" aria-label="terms of service">
							Terms of service
						</Link>
					) : null} */}
				</div>
			</div>
		</footer>
	);
};
