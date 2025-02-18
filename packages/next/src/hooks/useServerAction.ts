'use client';

import { MessageType } from '@/types';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

export const useServerAction = ({
	action,
	identifier,
	secondaryIdentifier
}: {
	action: any;
	identifier: string[] | string;
	secondaryIdentifier?: string[] | string | null;
}) => {
	const [state, formAction, isPending] = useActionState(
		action.bind(null, identifier, secondaryIdentifier ? secondaryIdentifier : null),
		{
			message: '',
			type: MessageType.Uninitialized
		}
	);

	useEffect(() => {
		if (state.type === MessageType.Error) toast.error(state.message);
		else if (state.type === MessageType.Success) {
			toast.success(state.message);
		}

		return () => {
			if (state.type !== MessageType.Uninitialized) {
				state.type = MessageType.Uninitialized;
				state.message = '';
			}
		};
	}, [state.message, state.type, state]);

	return { formAction, isPending, state };
};
