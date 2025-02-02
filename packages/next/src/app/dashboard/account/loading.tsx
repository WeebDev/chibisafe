import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountLoading() {
	return (
		<div className="px-2 w-full">
			<div className="flex flex-col lg:flex-row gap-8">
				<div className="flex flex-col gap-2 lg:w-2/4">
					<div className="flex flex-col gap-1">
						<Label htmlFor="username">Your username</Label>
						<Skeleton className="h-10 w-full" />
						<p className="text-[0.8rem] text-muted-foreground">
							Can't be changed, only for display purposes
						</p>
					</div>

					<Separator className="my-4" />

					<div className="grid gap-2">
						<div className="grid gap-1">
							<Label htmlFor="currentpassword">Current password</Label>
							<Skeleton className="h-10 w-full" />
						</div>
						<div className="grid gap-1">
							<Label htmlFor="newpassword">New password</Label>
							<Skeleton className="h-10 w-full" />
						</div>
						<div className="grid gap-1">
							<Label htmlFor="repassword">Repeat password</Label>
							<Skeleton className="h-10 w-full" />
						</div>
						<Skeleton className="h-10 w-max mt-3 py-2 px-4">Change password</Skeleton>
					</div>
				</div>
				<div className="flex flex-col w-full">
					<div className="flex flex-col gap-1">
						<Label htmlFor="apikey">API key</Label>
						<Skeleton className="h-10 w-full" />

						<p className="text-[0.8rem] text-muted-foreground">
							You can use the API key for 3rd-party services and scripts to gain access to your account.{' '}
							<br />
							Keep in mind that regenerating it will invalidate the previous key.
						</p>

						<Skeleton className="h-10 w-max mt-3 py-2 px-4">Request new API key</Skeleton>
					</div>
				</div>
			</div>
		</div>
	);
}
