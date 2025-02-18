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
import { useRouter } from 'next/navigation';
import { banIp } from '@/actions/IpActions';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

export function BanThisIpDialog({
	ip,
	className
}: PropsWithChildren<{ readonly className?: string; readonly ip: string }>) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [state, formAction] = useActionState(banIp, {
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
	}, [router, state, state.message, state.type]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className={className} variant={'destructive'}>
					<Trash2Icon className="mr-2 h-4 w-4" />
					Ban this IP
				</Button>
			</DialogTrigger>
			<DialogContent className="w-11/12">
				<form action={formAction}>
					<input type="hidden" name="ip" value={ip} />
					<DialogHeader>
						<DialogTitle>Ban this IP</DialogTitle>
						<DialogDescription>
							The IP <strong>{ip}</strong> will be banned and won't be able to use the service until
							unbanned. You sure you want to continue?
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 mb-4">
						<div className="grid gap-4 mt-4">
							<div>
								<Label htmlFor="reason">Reason</Label>
								<Textarea
									id="reason"
									name="reason"
									placeholder="Reason for ban"
									className="col-span-4"
								/>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit">Confirm</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
