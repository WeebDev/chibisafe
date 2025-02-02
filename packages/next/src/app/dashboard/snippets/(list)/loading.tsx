import { Skeleton } from '@/components/ui/skeleton';

export default function SnippetsLoading() {
	return (
		<div className="grid gap-4 grid-cols-1 w-full">
			<Skeleton className="h-36 w-full" />
			<Skeleton className="h-36 w-full" />
			<Skeleton className="h-36 w-full" />
		</div>
	);
}
