'use client';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { changePassword } from '@/actions/AuthActions';
import { MessageType } from '@/types';
import { useEffect, useActionState } from 'react';
import { toast } from 'sonner';

export const ChangePassword = () => {
	const [state, formAction] = useActionState(changePassword, {
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
			<div className="grid gap-2">
				<div className="grid gap-1">
					<Label htmlFor="currentpassword">Current password</Label>
					<Input
						id="currentpassword"
						name="currentpassword"
						type="password"
						autoCapitalize="none"
						autoComplete="none"
						autoCorrect="off"
						required
					/>
				</div>
				<div className="grid gap-1">
					<Label htmlFor="newpassword">New password</Label>
					<Input
						id="newpassword"
						name="newpassword"
						type="password"
						autoCapitalize="none"
						autoComplete="none"
						autoCorrect="off"
						required
					/>
				</div>
				<div className="grid gap-1">
					<Label htmlFor="repassword">Repeat password</Label>
					<Input
						id="repassword"
						name="repassword"
						type="password"
						autoCapitalize="none"
						autoComplete="none"
						autoCorrect="off"
						required
					/>
				</div>
				<Button type="submit" className="w-max mt-3">
					Change password
				</Button>
			</div>
		</form>
	);
};
