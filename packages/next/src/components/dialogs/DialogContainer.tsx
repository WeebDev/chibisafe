'use client';

import type { PropsWithChildren, ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { useMediaQuery } from 'usehooks-ts';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

export function DialogContainer({
	children,
	button,
	title,
	description,
	open,
	onOpenChange
}: PropsWithChildren<{
	readonly button: ReactNode | string;
	readonly description: string;
	onOpenChange(open: boolean): void;
	readonly open: boolean;
	readonly title: string;
}>) {
	const isMobile = useMediaQuery('(max-width: 768px)');

	return isMobile ? (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerTrigger asChild>
				{typeof button === 'string' ? (
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						{button}
					</Button>
				) : (
					button
				)}
			</DrawerTrigger>
			<DrawerContent>
				<div className="grid gap-1.5 py-4 px-8 text-center sm:text-left">
					<h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
					<p className="text-sm text-muted-foreground">{description}</p>
				</div>

				<div className="p-8 pt-0">{children}</div>
			</DrawerContent>
		</Drawer>
	) : (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				{typeof button === 'string' ? (
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						{button}
					</Button>
				) : (
					button
				)}
			</DialogTrigger>
			<DialogContent className="w-11/12">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	);
}
