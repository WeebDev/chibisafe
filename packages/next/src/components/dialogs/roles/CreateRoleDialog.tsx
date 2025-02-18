'use client';

import { useEffect, useState } from 'react';
import { MessageType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useServerAction } from '@/hooks/useServerAction';
import { createRole } from '@/actions/RoleActions';
import { DialogContainer } from '@/components/dialogs/DialogContainer';
import { useQueryClient } from '@tanstack/react-query';

export function CreateRoleDialog() {
	const [open, setOpen] = useState(false);
	return (
		<DialogContainer
			button="New role"
			title="Create new role"
			description="Use this form to create a new role and be able to later assign permissions and storage quotas to it."
			open={open}
			onOpenChange={setOpen}
		>
			<Form onSuccess={() => setOpen(false)} />
		</DialogContainer>
	);
}

const Form = ({ onSuccess }: { onSuccess(): void }) => {
	const [name, setName] = useState('');
	const queryClient = useQueryClient();

	const { formAction, isPending, state } = useServerAction({
		action: createRole,
		identifier: name
	});

	useEffect(() => {
		if (state.type === MessageType.Success) {
			onSuccess?.();
			void queryClient.invalidateQueries({ queryKey: ['roles'] });
		}

		return () => {
			setName('');
		};
	}, [onSuccess, queryClient, state.type]);

	return (
		<form action={formAction}>
			<div className="flex flex-col gap-4 my-4">
				<div className="flex flex-col gap-2">
					<Label htmlFor="name">Role</Label>
					<Input
						id="name"
						name="name"
						value={name}
						placeholder="New role name"
						onChange={event => setName(event.target.value)}
					/>
				</div>
			</div>
			<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
				<Button type="submit" disabled={isPending}>
					Create
				</Button>
			</div>
		</form>
	);
};
