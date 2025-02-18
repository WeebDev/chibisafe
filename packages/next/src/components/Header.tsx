import { Navigation } from '@/components/Navigation';
import { NavigationUser } from '@/components/NavigationUser';
import { DiscordLogo } from '@/components/svg/DiscordLogo';
import { GitHubLogo } from '@/components/svg/GitHubLogo';
import { PatreonLogo } from '@/components/svg/PatreonLogo';
import { UploadProgress } from '@/components/UploadProgress';
import { buttonVariants } from '@/styles/button';
import { ChibisafeLogo } from './svg/ChibisafeLogo';
import { openAPIClient } from '@/lib/serverFetch';

export const Header = async () => {
	const { data } = await openAPIClient.GET('/api/v1/settings');

	return (
		<header className="container z-40">
			<div className="flex h-16 sm:h-20 place-content-between place-items-center">
				<Navigation logo={<ChibisafeLogo className="w-6 h-6" />} serviceName={data?.siteName.value} />
				<UploadProgress />
				<nav className="flex items-center gap-1">
					<a href="https://discord.gg/5g6vgwn" target="_blank" rel="noopener noreferrer">
						<div
							className={buttonVariants({
								size: 'icon',
								variant: 'ghost'
							})}
						>
							<DiscordLogo className="h-6 w-6" />
							<span className="sr-only">Discord</span>
						</div>
					</a>

					<a href="https://github.com/chibisafe/chibisafe" target="_blank" rel="noopener noreferrer">
						<div
							className={buttonVariants({
								size: 'icon',
								variant: 'ghost'
							})}
						>
							<GitHubLogo className="h-6 w-6" />
							<span className="sr-only">GitHub</span>
						</div>
					</a>

					<a href="https://patreon.com/pitu" target="_blank" rel="noopener noreferrer">
						<div
							className={buttonVariants({
								size: 'icon',
								variant: 'ghost'
							})}
						>
							<PatreonLogo className="h-6 w-6" />
							<span className="sr-only">Patreon</span>
						</div>
					</a>
					<div className="hidden md:inline-flex ml-4">
						<NavigationUser />
					</div>
				</nav>
			</div>
		</header>
	);
};
