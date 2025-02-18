'use client';

import type { PropsWithChildren } from 'react';
import { enableUser, disableUser, purgeUser } from '@/actions/UserActions';
import { useSetAtom } from 'jotai';
import { confirmationDialogAtom } from '@/lib/atoms/dialogs/confirmationDialog';
import { useServerAction } from '@/hooks/useServerAction';

export const UserActionsButton = ({
	uuid,
	type,
	description,
	children
}: PropsWithChildren<{ readonly description: string; readonly type: string; readonly uuid: string }>) => {
	let actionToPerform;
	switch (type) {
		case 'enable':
			actionToPerform = enableUser;
			break;
		case 'disable':
			actionToPerform = disableUser;
			break;
		case 'purge':
			actionToPerform = purgeUser;
			break;
		default:
			throw new Error('Invalid type');
	}

	const setConfirmationDialog = useSetAtom(confirmationDialogAtom);
	const { formAction, isPending } = useServerAction({
		action: actionToPerform,
		identifier: uuid
	});

	return (
		<button
			type="button"
			className="w-full h-full flex px-2 py-1.5 cursor-default"
			disabled={isPending}
			onClick={() => {
				setConfirmationDialog({
					callback: () => formAction(),
					description
				});
			}}
		>
			{children}
		</button>
	);
};
