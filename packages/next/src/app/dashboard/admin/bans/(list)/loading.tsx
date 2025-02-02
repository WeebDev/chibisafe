import { Skeleton } from '@/components/ui/skeleton';

export default function IpLoading() {
	return (
		<div className="grid gap-4 grid-cols-1 w-full">
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
		</div>
	);
}
