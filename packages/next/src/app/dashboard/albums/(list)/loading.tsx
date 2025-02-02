import { Skeleton } from '@/components/ui/skeleton';

export default function AlbumsLoading() {
	return (
		<div className="grid gap-8 grid-cols-2 lg:grid-cols-3 w-full">
			<Skeleton className="h-56 sm:h-96 w-full" />
			<Skeleton className="h-56 sm:h-96 w-full" />
			<Skeleton className="h-56 sm:h-96 w-full" />
		</div>
	);
}
