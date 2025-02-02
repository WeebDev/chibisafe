import { Skeleton } from '@/components/ui/skeleton';

export default function RolesLoading() {
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
