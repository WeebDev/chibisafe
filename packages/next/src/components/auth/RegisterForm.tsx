'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { buttonVariants } from '@/styles/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { openAPIClient } from '@/lib/clientFetch';

export const RegisterForm = ({ code }: { readonly code?: string }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	async function onSubmit(form: FormData) {
		setIsLoading(true);

		const password = form.get('password');
		const repassword = form.get('repassword');

		if (password !== repassword) {
			toast.error('Passwords do not match');
			setIsLoading(false);
			return;
		}

		try {
			const { error } = await openAPIClient.POST('/api/v1/auth/register', {
				body: {
					username: form.get('username') as string,
					password: form.get('password') as string,
					...(code ? { inviteCode: code } : null)
				}
			});

			if (error) {
				toast.error(error.message);
				return;
			}

			router.push('/login');
		} catch (error: any) {
			toast.error(error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className={cn('grid gap-6')}>
			<form action={onSubmit}>
				{code ? <input type="hidden" name="code" value={code} /> : null}
				<div className="grid gap-2">
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="username">
							Username
						</Label>
						<Input
							id="username"
							name="username"
							placeholder="Username"
							type="text"
							autoCapitalize="none"
							autoComplete="username"
							autoCorrect="off"
							readOnly={isLoading}
							required
						/>
					</div>
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="password">
							Password
						</Label>
						<Input
							id="password"
							name="password"
							placeholder="Password"
							type="password"
							autoCapitalize="none"
							autoComplete="password"
							autoCorrect="off"
							readOnly={isLoading}
							required
						/>
					</div>
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="repassword">
							Repeat password
						</Label>
						<Input
							id="repassword"
							name="repassword"
							placeholder="Repeat password"
							type="password"
							autoCapitalize="none"
							autoComplete="password"
							autoCorrect="off"
							readOnly={isLoading}
							required
						/>
					</div>
					<button type="submit" className={cn(buttonVariants())} disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Register
					</button>
				</div>
			</form>
		</div>
	);
};
