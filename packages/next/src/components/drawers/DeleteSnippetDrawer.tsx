'use client';

import { useEffect, useState, useActionState } from 'react';
import { MessageType } from '@/types';
import { Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { deleteSnippet } from '@/actions/SnippetActions';
import { useRouter } from 'next/navigation';

export function DeleteSnippetDrawer({ className, uuid }: { readonly className?: string; readonly uuid: string }) {
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
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button className={className} variant={'destructive'}>
					<Trash2Icon className="mr-2 h-4 w-4" />
					Delete
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="grid gap-1.5 py-4 px-8 text-center sm:text-left">
					<h2 className="text-lg font-semibold leading-none tracking-tight">Delete snippet</h2>
					<p className="text-sm text-muted-foreground">
						You sure you want to continue? This action is irreversible.
					</p>
				</div>

				<form action={formAction}>
					<input type="hidden" name="uuid" value={uuid} />
					<div className="grid gap-4 py-4 px-8">
						<Button type="submit" className="mb-4 w-full">
							Confirm
						</Button>
					</div>
				</form>
			</DrawerContent>
		</Drawer>
	);
}
