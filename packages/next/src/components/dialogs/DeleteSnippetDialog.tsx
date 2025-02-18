'use client';

import type { PropsWithChildren } from 'react';
import { useEffect, useState, useActionState } from 'react';
import { MessageType } from '@/types';
import { Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { deleteSnippet } from '@/actions/SnippetActions';
import { useRouter } from 'next/navigation';

export function DeleteSnippetDialog({
	className,
	uuid
}: PropsWithChildren<{ readonly className?: string; readonly uuid: string }>) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [state, formAction] = useActionState(deleteSnippet, {
		message: '',
		type: MessageType.Uninitialized
	});

	useEffect(() => {
		if (state.type === MessageType.Error) toast.error(state.message);
		else if (state.type === MessageType.Success) {
			toast.success(state.message);
			setOpen(false);
			router.push('/dashboard/snippets');
		}

		return () => {
			if (state.type === MessageType.Success) {
				state.type = MessageType.Uninitialized;
				state.message = '';
			}
		};
	}, [router, state, state.message, state.type]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={'destructive'} className={className}>
					<Trash2Icon className="mr-2 h-4 w-4" />
					Delete
				</Button>
			</DialogTrigger>
			<DialogContent className="w-11/12">
				<form action={formAction}>
					<input type="hidden" name="uuid" value={uuid} />
					<DialogHeader>
						<DialogTitle>Delete snippet</DialogTitle>
						<DialogDescription>
							You sure you want to continue? This action is irreversible.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="mt-4">
						<Button type="submit">Confirm</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
