'use client';

import { useEffect, useState, useActionState } from 'react';
import { MessageType } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { banIp } from '@/actions/IpActions';
import { Textarea } from '../ui/textarea';
import { DialogContainer } from '@/components/dialogs/DialogContainer';

export function BanIpDialog() {
	const [open, setOpen] = useState(false);
	return (
		<DialogContainer
			button="Ban new IP"
			title="Ban new IP"
			description="The submitted IP will be banned and won't be able to use the service until unbanned."
			open={open}
			onOpenChange={setOpen}
		>
			<Form onSuccess={() => setOpen(false)} />
		</DialogContainer>
	);
}

const Form = ({ onSuccess }: { onSuccess(): void }) => {
	const [state, formAction] = useActionState(banIp, {
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
					<Label htmlFor="ip">IP</Label>
					<Input id="ip" name="ip" placeholder="127.0.0.69" className="col-span-3" />
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="reason">Reason</Label>
					<Textarea id="reason" name="reason" placeholder="Reason for ban" className="col-span-4" />
				</div>
			</div>
			<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
				<Button type="submit">Submit</Button>
			</div>
		</form>
	);
};
