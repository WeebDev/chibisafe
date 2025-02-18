'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { Loader2 } from 'lucide-react';
import { currentUserAtom } from '@/lib/atoms/currentUser';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { buttonVariants } from '@/styles/button';
import { toast } from 'sonner';
import { openAPIClient } from '@/lib/clientFetch';

export const LoginForm = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const setCurrentUser = useSetAtom(currentUserAtom);
	const usernameInputRef = useRef<HTMLInputElement>(null);

	async function onSubmit(form: FormData) {
		setIsLoading(true);

		try {
			const { data, error } = await openAPIClient.POST('/api/v1/auth/login', {
				body: {
					username: form.get('username') as string,
					password: form.get('password') as string
				}
			});

			console.log(data);

			if (error) {
				toast.error(error.message);
				return;
			}

			setCurrentUser(data.user);

			router.push('/dashboard');
		} catch (error: any) {
			toast.error(error);
			console.error(error);
			usernameInputRef.current?.focus();
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className={cn('grid gap-6')}>
			<form action={onSubmit}>
				<div className="grid gap-2">
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="username">
							Username
						</Label>
						<Input
							ref={usernameInputRef}
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
					<button type="submit" className={cn(buttonVariants())} disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Sign In
					</button>
				</div>
			</form>
		</div>
	);
};
