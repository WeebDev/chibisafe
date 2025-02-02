import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsLoading() {
	return (
		<div className="px-2 w-full space-y-8">
			<div className="space-y-2">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-5 w-full" />
			</div>
			<div className="space-y-2">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-5 w-full" />
			</div>
			<div className="space-y-2">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-5 w-full" />
			</div>
			<div className="space-y-2">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-5 w-full" />
			</div>
			<div className="space-y-2">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-5 w-full" />
			</div>
		</div>
	);
}
