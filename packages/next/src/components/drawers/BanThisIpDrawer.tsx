'use client';

import { useEffect, useState, useActionState } from 'react';
import { MessageType } from '@/types';
import { Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { banIp } from '@/actions/IpActions';
import { Textarea } from '../ui/textarea';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useRouter } from 'next/navigation';

export function BanThisIpDrawer({ className, ip }: { readonly className?: string; readonly ip: string }) {
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
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button className={className} variant={'destructive'}>
					<Trash2Icon className="mr-2 h-4 w-4" />
					Ban this IP
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="grid gap-1.5 py-4 px-8 text-center sm:text-left">
					<h2 className="text-lg font-semibold leading-none tracking-tight">Ban this IP</h2>
					<p className="text-sm text-muted-foreground">
						The IP <strong>{ip}</strong> will be banned and won't be able to use the service until unbanned.
						You sure you want to continue?
					</p>
				</div>

				<form action={formAction}>
					<input type="hidden" name="ip" value={ip} />
					<div className="grid gap-4 py-4 px-8">
						<div className="grid gap-4">
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
						<Button type="submit" className="mb-4 w-full">
							Confirm
						</Button>
					</div>
				</form>
			</DrawerContent>
		</Drawer>
	);
}
