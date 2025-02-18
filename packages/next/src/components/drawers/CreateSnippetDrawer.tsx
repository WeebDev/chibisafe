'use client';

import { useEffect, useState, useActionState } from 'react';
import { MessageType } from '@/types';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { supportedLanguages } from '@/lib/snippets';
import { Combobox } from '../Combobox';
import { createSnippet } from '@/actions/SnippetActions';

export function CreateSnippetDrawer({ className }: { readonly className?: string }) {
	const [open, setOpen] = useState(false);
	const [state, formAction] = useActionState(createSnippet, {
		message: '',
		type: MessageType.Uninitialized
	});

	useEffect(() => {
		if (state.type === MessageType.Error) toast.error(state.message);
		else if (state.type === MessageType.Success) {
			toast.success(state.message);
			setOpen(false);
		}

		return () => {
			if (state.type === MessageType.Success) {
				state.type = MessageType.Uninitialized;
				state.message = '';
			}
		};
	}, [state, state.message, state.type]);

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button className={className}>
					<Plus className="mr-2 h-4 w-4" />
					New snippet
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="grid gap-1.5 py-4 px-8 text-center sm:text-left">
					<h2 className="text-lg font-semibold leading-none tracking-tight">New snippet</h2>
					<p className="text-sm text-muted-foreground">Create a new snippet</p>
				</div>

				<form action={formAction}>
					<div className="grid gap-4 py-4 px-8">
						<div className="flex flex-col gap-4">
							<div className="w-full">
								<Label htmlFor="name">Name</Label>
								<Input name="name" id="name" />
							</div>
							<div>
								<Label htmlFor="language">Language</Label>
								<Combobox data={supportedLanguages} />
							</div>

							<Textarea
								placeholder="Write your thoughts here..."
								className="h-60"
								name="content"
								id="content"
							/>
						</div>
						<Button type="submit" className="mb-4 w-full">
							Create
						</Button>
					</div>
				</form>
			</DrawerContent>
		</Drawer>
	);
}
