'use client';

import { useEffect, useState, useActionState } from 'react';
import { MessageType } from '@/types';
import { Plus } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '../ui/textarea';
import { supportedLanguages } from '@/lib/snippets';
import { Combobox } from '../Combobox';
import { createSnippet } from '@/actions/SnippetActions';

export function CreateSnippetDialog({ className }: { readonly className?: string }) {
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
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className={className}>
					<Plus className="mr-2 h-4 w-4" />
					New snippet
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[800px] w-11/12">
				<form action={formAction}>
					<DialogHeader>
						<DialogTitle>New snippet</DialogTitle>
						<DialogDescription>Create a new snippet here</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="w-full">
								<Label htmlFor="name">Name</Label>
								<Input name="name" id="name" />
							</div>
							<div>
								<Label htmlFor="language">Language</Label>
								<Combobox data={supportedLanguages} />
							</div>
						</div>

						<Textarea
							placeholder="Write your thoughts here..."
							className="h-60"
							name="content"
							id="content"
						/>
					</div>
					<DialogFooter>
						<Button type="submit">Create</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
