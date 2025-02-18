import { type PropsWithChildren } from 'react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { UserActionsButton } from './UserActionsButton';
import { MoreHorizontalIcon } from 'lucide-react';
import Link from 'next/link';
import type { UserWithRolesAndQuota } from '@/types';
import { AssignRolesDialog } from '@/components/dialogs/roles/AssignRolesDialog';
import { cn } from '@/lib/utils';

export function UserTableActions({ user }: PropsWithChildren<{ readonly user: UserWithRolesAndQuota }>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size={'icon'} title="Actions">
					<MoreHorizontalIcon className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end">
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<Link href={`/dashboard/admin/users/${user.uuid}`}>View files</Link>
					</DropdownMenuItem>
					<DropdownMenuItem className="p-0" onSelect={e => e.preventDefault()}>
						<AssignRolesDialog
							uuid={user.uuid}
							roles={user.roles?.map(role => role.uuid) ?? []}
							className={cn('h-full w-full flex px-2 py-1.5 cursor-default')}
						/>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{user.enabled ? (
						<DropdownMenuItem className="p-0" onSelect={e => e.preventDefault()}>
							<UserActionsButton
								uuid={user.uuid}
								type="disable"
								description="This action will disable the user and thus prevent them from logging into chibisafe again until you enable them once more. All uploaded files and albums will remain intact."
							>
								Disable
							</UserActionsButton>
						</DropdownMenuItem>
					) : (
						<DropdownMenuItem className="p-0" onSelect={e => e.preventDefault()}>
							<UserActionsButton
								uuid={user.uuid}
								type="enable"
								description="This action will enable the user and allow them to log into chibisafe again. They'll be able to access all previous uploads and albums."
							>
								Enable
							</UserActionsButton>
						</DropdownMenuItem>
					)}
					<DropdownMenuItem
						className="focus:text-destructive-foreground focus:bg-destructive p-0"
						onSelect={e => e.preventDefault()}
					>
						<UserActionsButton
							uuid={user.uuid}
							type="purge"
							description="This action will delete ALL files, albums, tags and snippets created by the user. This action is not reversible."
						>
							Purge
						</UserActionsButton>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
