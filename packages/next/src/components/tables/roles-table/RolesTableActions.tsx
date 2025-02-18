'use client';

import { useEffect, type PropsWithChildren } from 'react';
import type { Role } from '@/types';
import { MessageType } from '@/types';
import { useMediaQuery } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { buttonVariants } from '@/styles/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useSetAtom } from 'jotai';
import { confirmationDialogAtom } from '@/lib/atoms/dialogs/confirmationDialog';
import { cn } from '@/lib/utils';
import { useServerAction } from '@/hooks/useServerAction';
import { isDialogOpenAtom } from '@/lib/atoms/fileDialog';
import { useQueryClient } from '@tanstack/react-query';
import { deleteRole } from '@/actions/RoleActions';
import { SetRoleQuotaDialog } from '@/components/dialogs/roles/SetRoleQuotaDialog';
import { SetRolePermissionsDialog } from '@/components/dialogs/roles/SetRolePermissionsDialog';

const DeleteRoleButton = ({
	uuid,
	className,
	isMobile = false
}: {
	readonly className?: string;
	readonly isMobile?: boolean;
	readonly uuid: string;
}) => {
	const setConfirmationDialog = useSetAtom(confirmationDialogAtom);
	const setIsDialogOpen = useSetAtom(isDialogOpenAtom);
	const { formAction, isPending, state } = useServerAction({
		action: deleteRole,
		identifier: [uuid]
	});
	const queryClient = useQueryClient();

	useEffect(() => {
		if (state.type === MessageType.Success) {
			void queryClient.invalidateQueries({ queryKey: ['uploads'] });
			setIsDialogOpen(false);
		}
	}, [state.type, setIsDialogOpen, queryClient]);

	return (
		<button
			type="button"
			disabled={isPending}
			className={cn(isMobile ? buttonVariants({ variant: 'destructive' }) : null, 'w-full', className)}
			onClick={() =>
				setConfirmationDialog({
					callback: () => formAction(),
					description: 'Are you sure you want to delete this role?'
				})
			}
		>
			Delete
		</button>
	);
};

export function RolesTableActions({ role }: PropsWithChildren<{ readonly role: Role }>) {
	const isMobile = useMediaQuery('(max-width: 768px)');

	return isMobile ? (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="secondary">Actions</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="p-4 pb-0 grid gap-2 mb-2">
					<SetRoleQuotaDialog
						uuid={role.uuid}
						className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
					/>
					<SetRolePermissionsDialog
						role={role}
						className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
					/>
					<DeleteRoleButton uuid={role.uuid} isMobile={true} />
				</div>
			</DrawerContent>
		</Drawer>
	) : (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="secondary">Actions</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuItem className="p-0" onSelect={e => e.preventDefault()}>
						<SetRoleQuotaDialog
							uuid={role.uuid}
							className={cn('h-full w-full flex px-2 py-1.5 cursor-default')}
						/>
					</DropdownMenuItem>
					<DropdownMenuItem className="p-0" onSelect={e => e.preventDefault()}>
						<SetRolePermissionsDialog
							role={role}
							className={cn('h-full w-full flex px-2 py-1.5 cursor-default')}
						/>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						className="focus:text-destructive-foreground focus:bg-destructive p-0"
						onSelect={e => e.preventDefault()}
					>
						<DeleteRoleButton uuid={role.uuid} className="h-full flex px-2 py-1.5 cursor-default" />
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
