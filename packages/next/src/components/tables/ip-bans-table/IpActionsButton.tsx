'use client';

import type { PropsWithChildren } from 'react';
import { purgeIp, unbanIp } from '@/actions/IpActions';
import { useServerAction } from '@/hooks/useServerAction';
import { useSetAtom } from 'jotai';
import { confirmationDialogAtom } from '@/lib/atoms/dialogs/confirmationDialog';

export const IpActionsButton = ({
	uuid,
	type,
	description,
	children
}: PropsWithChildren<{
	readonly description: string;
	readonly type: string;
	readonly uuid: string;
}>) => {
	const setConfirmationDialog = useSetAtom(confirmationDialogAtom);
	let actionToPerform;
	switch (type) {
		case 'unban':
			actionToPerform = unbanIp;
			break;
		case 'purge':
			actionToPerform = purgeIp;
			break;
		default:
			throw new Error('Invalid type');
	}

	const { formAction, isPending } = useServerAction({
		action: actionToPerform,
		identifier: uuid
	});

	return (
		<button
			type="button"
			disabled={isPending}
			className="w-full h-full flex px-2 py-1.5 cursor-default"
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
