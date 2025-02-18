'use client';

import { useActionState, useEffect, useState } from 'react';
import { MessageType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createAlbum } from '@/actions/CreateAlbum';
import { toast } from 'sonner';
import { DialogContainer } from './DialogContainer';

export function CreateAlbumDialog() {
	const [open, setOpen] = useState(false);
	return (
		<DialogContainer
			button="New album"
			title="New album"
			description="Create a new album."
			open={open}
			onOpenChange={setOpen}
		>
			<Form onSuccess={() => setOpen(false)} />
		</DialogContainer>
	);
}

const Form = ({ onSuccess }: { onSuccess(): void }) => {
	const [state, formAction] = useActionState(createAlbum, {
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
					<Label htmlFor="name">Name</Label>
					<Input id="album" name="album" placeholder="New album name" className="col-span-3" />
				</div>
			</div>
			<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
				<Button type="submit">Create</Button>
			</div>
		</form>
	);
};
