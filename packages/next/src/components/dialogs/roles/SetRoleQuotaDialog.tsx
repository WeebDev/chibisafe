'use client';

import { useEffect, useState } from 'react';
import { MessageType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useServerAction } from '@/hooks/useServerAction';
import { setRoleQuota } from '@/actions/RoleActions';
import { formatBytes } from '@/lib/file';
import { DialogContainer } from '@/components/dialogs/DialogContainer';

export function SetRoleQuotaDialog({ className, uuid }: { readonly className?: string; readonly uuid: string }) {
	const [open, setOpen] = useState(false);
	return (
		<DialogContainer
			button={
				<button type="button" className={className}>
					Edit role quota
				</button>
			}
			title="Edit role quota"
			description="Use this form to edit the storage quota for this role. The quota is the maximum amount of storage that can be used by all users with this role."
			open={open}
			onOpenChange={setOpen}
		>
			<Form onSuccess={() => setOpen(false)} uuid={uuid} />
		</DialogContainer>
	);
}

const Form = ({ onSuccess, uuid }: { onSuccess(): void; readonly uuid: string }) => {
	const [quota, setQuota] = useState(0);

	const { formAction, isPending, state } = useServerAction({
		action: setRoleQuota,
		identifier: uuid,
		secondaryIdentifier: String(quota)
	});

	useEffect(() => {
		if (state.type === MessageType.Success) {
			onSuccess?.();
		}

		return () => {
			setQuota(0);
		};
	}, [onSuccess, state.type]);

	return (
		<form action={formAction}>
			<div className="flex flex-col gap-4 my-4">
				<div className="flex flex-col gap-2">
					<Label htmlFor="name">Allocated space for role</Label>
					<Input
						id="quota"
						name="quota"
						type="number"
						value={quota}
						placeholder="Quota"
						onChange={event => setQuota(Number.parseInt(event.target.value, 10) || 0)}
					/>
					<p className="text-muted-foreground text-sm">{formatBytes(quota)}</p>
				</div>
			</div>
			<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
				<Button type="submit" disabled={isPending}>
					Change
				</Button>
			</div>
		</form>
	);
};
