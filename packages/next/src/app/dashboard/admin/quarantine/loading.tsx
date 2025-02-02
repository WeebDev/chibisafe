import { Skeleton } from '@/components/ui/skeleton';

export default function QuarantineLoading() {
	return (
		<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full">
			<Skeleton className="h-40 w-full" />
			<Skeleton className="h-40 w-full" />
			<Skeleton className="h-40 w-full" />
			<Skeleton className="h-40 w-full" />
			<Skeleton className="h-40 w-full" />
			<Skeleton className="h-40 w-full" />
		</div>
	);
}
