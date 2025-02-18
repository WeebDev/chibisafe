'use client';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { requestNewApiKey } from '@/actions/AuthActions';
import { MessageType } from '@/types';
import type { PropsWithChildren } from 'react';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

export const RegenerateApiKey = ({ apiKey }: PropsWithChildren<{ readonly apiKey: string }>) => {
	const [state, formAction] = useActionState(requestNewApiKey, {
		message: '',
		type: MessageType.Uninitialized
	});

	useEffect(() => {
		if (state.type === MessageType.Error) toast.error(state.message);
		else if (state.type === MessageType.Success) {
			toast.success(state.message);
		}

		return () => {
			if (state.type === MessageType.Success) {
				state.type = MessageType.Uninitialized;
				state.message = '';
			}
		};
	}, [state, state.message, state.type]);

	return (
		<form action={formAction}>
			<div className="flex flex-col gap-1">
				<Label htmlFor="apikey">API key</Label>
				<Input
					name="apikey"
					id="apikey"
					value={apiKey ?? ''}
					readOnly
					className={apiKey ? 'blur-sm hover:blur-none' : ''}
				/>
				<p className="text-[0.8rem] text-muted-foreground">
					You can use the API key for 3rd-party services and scripts to gain access to your account. <br />
					Keep in mind that regenerating it will invalidate the previous key.
				</p>
				<Button type="submit" variant="destructive" className="w-max mt-3">
					Request new API key
				</Button>
			</div>
		</form>
	);
};
