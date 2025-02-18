'use client';

import { useEffect, useState, useActionState } from 'react';
import { MessageType } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogContainer } from '@/components/dialogs/DialogContainer';
import { createUser } from '@/actions/UserActions';

export function CreateUserDialog() {
	const [open, setOpen] = useState(false);
	return (
		<DialogContainer
			button="Create user"
			title="Create user"
			description="Create a new user."
			open={open}
			onOpenChange={setOpen}
		>
			<Form onSuccess={() => setOpen(false)} />
		</DialogContainer>
	);
}

const Form = ({ onSuccess }: { onSuccess(): void }) => {
	const [state, formAction] = useActionState(createUser, {
		message: '',
		type: MessageType.Uninitialized
	});

	useEffect(() => {
		if (state.type === MessageType.Error) toast.error(state.message);
		else if (state.type === MessageType.Success) {
			toast.success(state.message);
			onSuccess?.();
		}

		return () => {
			if (state.type === MessageType.Success) {
				state.type = MessageType.Uninitialized;
				state.message = '';
			}
		};
	}, [onSuccess, state, state.message, state.type]);

	return (
		<form action={formAction}>
			<div className="flex flex-col gap-4 my-4">
				<div className="flex flex-col gap-2">
					<Label htmlFor="username">Username</Label>
					<Input id="username" name="username" placeholder="user1" />
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="password">Password</Label>
					<Input id="password" name="password" type="password" />
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="repassword">Re-enter password</Label>
					<Input id="repassword" name="repassword" type="password" />
				</div>
			</div>
			<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
				<Button type="submit">Submit</Button>
			</div>
		</form>
	);
};
