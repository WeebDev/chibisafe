'use client';

import { useAtomValue } from 'jotai';
import {
	BarChart3,
	Code,
	FileUp,
	Files,
	Key,
	Library,
	Network,
	Settings2,
	ShieldCheck,
	Tags,
	UserPlus,
	Users
} from 'lucide-react';

import { currentUserAtom } from '@/lib/atoms/currentUser';
import { DashboardSidebarItem } from '@/components/DashboardSidebarItem';
import { saveAs } from 'file-saver';
import request from '@/lib/request';
import type { UpdateCheck } from '@/types';
import { useEffect, useState } from 'react';

export function DashboardSidebar({ onClick }: { onClick?(): void }) {
	const currentUser = useAtomValue(currentUserAtom);
	const [update, setUpdate] = useState<UpdateCheck | undefined>(undefined);

	useEffect(() => {
		const checkForUpdates = async () => {
			if (currentUser?.permissions.canManageSettings) {
				const { data: response, error } = await request.get({
					url: 'admin/service/updateCheck'
				});

				if (error) {
					console.error(error);
					return;
				}

				setUpdate(response);
			}
		};

		void checkForUpdates();
	}, [currentUser?.permissions.canManageSettings]);

	const getShareXConfig = async (event: any) => {
		event.preventDefault();
		if (!currentUser?.apiKey) {
			// eslint-disable-next-line no-alert
			window.alert('You need to generate an API key first!');
			return;
		}

		const sharexFile = `{
      "Version": "14.0.0",
      "Name": "chibisafe",
      "DestinationType": "ImageUploader, FileUploader",
      "RequestMethod": "POST",
      "RequestURL": "${location.origin}/api/upload",
      "Headers": {
        "x-api-key": "${currentUser.apiKey}"
      },
      "Body": "MultipartFormData",
      "FileFormName": "file[]",
      "URL": "{json:url}",
      "ThumbnailURL": "{json:thumb}"
    }`;
		const sharexBlob = new Blob([sharexFile], { type: 'application/octet-binary' });
		saveAs(sharexBlob, `${location.hostname}.sxcu`);
	};

	return (
		<>
			<nav className="grid items-start gap-1" onClick={() => onClick?.()}>
				<h3 className="text-muted-foreground text-sm pointer-events-none">Main</h3>
				<DashboardSidebarItem href="/dashboard" name="Uploads" Icon={FileUp} />
				<DashboardSidebarItem href="/dashboard/albums" name="Albums" Icon={Library} />
				<DashboardSidebarItem href="/dashboard/tags" name="Tags" Icon={Tags} />
				<DashboardSidebarItem href="/dashboard/snippets" name="Snippets" Icon={Code} />
			</nav>
			<nav className="grid items-start gap-1 mt-4" onClick={() => onClick?.()}>
				<h3 className="text-muted-foreground text-sm pointer-events-none">Account</h3>
				<DashboardSidebarItem href="/dashboard/account" name="Credentials" Icon={Key} />
			</nav>
			{currentUser?.permissions.canManageSettings ? (
				<nav className="grid items-start gap-1 mt-4" onClick={() => onClick?.()}>
					<h3 className="text-muted-foreground text-sm pointer-events-none">Admin</h3>
					<DashboardSidebarItem href="/dashboard/admin/settings" name="Settings" Icon={Settings2} />
					<DashboardSidebarItem href="/dashboard/admin/users" name="Users" Icon={Users} />
					<DashboardSidebarItem href="/dashboard/admin/roles" name="Roles" Icon={ShieldCheck} />
					<DashboardSidebarItem href="/dashboard/admin/files" name="All files" Icon={Files} />
					<DashboardSidebarItem href="/dashboard/admin/quarantine" name="Quarantined files" Icon={Files} />
					<DashboardSidebarItem href="/dashboard/admin/bans" name="Banned IPs" Icon={Network} />
					<DashboardSidebarItem href="/dashboard/admin/invites" name="Invites" Icon={UserPlus} />
					<DashboardSidebarItem href="/dashboard/admin/statistics" name="Statistics" Icon={BarChart3} />
				</nav>
			) : null}
			<nav className="hidden items-start gap-1 mt-4 md:grid" onClick={() => onClick?.()}>
				<h3 className="text-muted-foreground text-sm pointer-events-none">Utils</h3>
				<a
					href="https://github.com/chibisafe/chibisafe-extension"
					rel="noopener noreferrer"
					target="_blank"
					className="text-sm font-medium link pl-4"
				>
					Browser extension
				</a>
				<a
					href="#"
					rel="noopener noreferrer"
					className="text-sm font-medium link pl-4"
					onClick={e => void getShareXConfig(e)}
				>
					ShareX config
				</a>
				<a
					href="https://www.icloud.com/shortcuts/a63987ea47204bbba24d063d620fcf94"
					rel="noopener noreferrer"
					className="text-sm font-medium link pl-4"
				>
					iOS share shortcut
				</a>
				{update?.updateAvailable ? (
					<div className="text-sm font-medium mt-4 flex flex-col justify-center items-center py-4 border">
						New version available
						<a
							href={update.latestVersionUrl}
							rel="noopener noreferrer"
							target="_blank"
							className="text-sm font-medium link"
						>
							v{update.latestVersion}
						</a>
					</div>
				) : null}
			</nav>
		</>
	);
}
