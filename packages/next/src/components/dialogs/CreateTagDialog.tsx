'use client';

import { useEffect, useState } from 'react';
import { MessageType } from '@/types';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createTag } from '@/actions/TagsActions';
import { openAPIClient } from '@/lib/clientFetch';
import { useServerAction } from '@/hooks/useServerAction';
import { FancyMultiSelect } from '@/components/FancyMultiSelect';
import { useMediaQuery } from 'usehooks-ts';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer';

type Tag = {
	label: string;
	value: string;
};

export function CreateTagDialog({ className }: { readonly className?: string }) {
	const [open, setOpen] = useState(false);
	const isMobile = useMediaQuery('(max-width: 768px)');

	return isMobile ? (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button className={className}>
					<Plus className="mr-2 h-4 w-4" />
					New tag
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="grid gap-1.5 py-4 px-8 text-center sm:text-left">
					<h2 className="text-lg font-semibold leading-none tracking-tight">New tag</h2>
					<p className="text-sm text-muted-foreground">Create a new tag</p>
				</div>

				<div className="p-8">
					<Form onSuccess={() => setOpen(false)} />
				</div>
			</DrawerContent>
		</Drawer>
	) : (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className={className}>
					<Plus className="mr-2 h-4 w-4" />
					New tag
				</Button>
			</DialogTrigger>
			<DialogContent className="w-11/12">
				<DialogHeader>
					<DialogTitle>New tag</DialogTitle>
					<DialogDescription>Create a new tag</DialogDescription>
				</DialogHeader>
				<Form onSuccess={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}

const Form = ({ onSuccess }: { onSuccess(): void }) => {
	const [name, setName] = useState('');
	const [tags, setTags] = useState<Tag[]>([]);
	const [selectedParents, setSelectedParents] = useState<string[]>([]);

	const { formAction, isPending, state } = useServerAction({
		action: createTag,
		identifier: name,
		secondaryIdentifier: selectedParents
	});

	useEffect(() => {
		if (state.type === MessageType.Success) {
			onSuccess?.();
		}

		const fetchData = async () => {
			const { data, error } = await openAPIClient.GET('/api/v1/tags', {
				params: {
					query: {
						limit: 9999
					}
				}
			});

			if (error) {
				toast.error(error.message);
				return;
			}

			setTags(
				data.results.map(tag => ({
					value: tag.uuid,
					label: `${tag.name}${tag.nearestParent ? ` (${tag.nearestParent.name})` : ''}`
				}))
			);
		};

		void fetchData();

		return () => {
			setSelectedParents([]);
			setName('');
		};
	}, [onSuccess, state.message, state.type]);

	return (
		<form action={formAction}>
			<div className="flex flex-col gap-4 my-4">
				<div className="flex flex-col gap-2">
					<Label htmlFor="name">Parent tags</Label>
					{tags.length ? (
						<FancyMultiSelect
							placeholder="Search for a parent tag..."
							options={
								tags?.map(tag => ({
									value: tag.value,
									label: tag.label
								})) ?? []
							}
							onSelected={async value => setSelectedParents(prev => [...prev, value])}
							onRemoved={async value => setSelectedParents(prev => prev.filter(v => v !== value))}
						/>
					) : (
						<p>No tags found</p>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="name">Tag</Label>
					<Input
						id="name"
						name="name"
						value={name}
						placeholder="New tag name"
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
