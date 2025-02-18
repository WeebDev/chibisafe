'use client';

import { useEffect, type PropsWithChildren } from 'react';
import { removeCollaborator } from '@/actions/AlbumSettingsDialogActions';
import { Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSetAtom } from 'jotai';
import { confirmationDialogAtom } from '@/lib/atoms/dialogs/confirmationDialog';
import { useServerAction } from '@/hooks/useServerAction';
import { useQueryClient } from '@tanstack/react-query';
import { MessageType } from '@/types';

export const DeleteCollaboratorButton = ({
	uuid,
	albumUuid
}: PropsWithChildren<{ readonly albumUuid: string; readonly uuid: string }>) => {
	const setConfirmationDialog = useSetAtom(confirmationDialogAtom);
	const { formAction, isPending, state } = useServerAction({
		action: removeCollaborator,
		identifier: uuid,
		secondaryIdentifier: albumUuid
	});

	const queryClient = useQueryClient();

	useEffect(() => {
		if (state.type === MessageType.Success) {
			void queryClient.invalidateQueries({ queryKey: ['collaborators', albumUuid] });
		}
	}, [state.type, queryClient, albumUuid]);

	return (
		<Button
			variant="outline"
			disabled={isPending}
			size={'icon'}
			onClick={() => {
				setConfirmationDialog({
					callback: () => formAction(),
					description: 'Are you sure you want to delete this link?'
				});
			}}
		>
			<Trash2Icon className="h-4 w-4" />
		</Button>
	);
};
