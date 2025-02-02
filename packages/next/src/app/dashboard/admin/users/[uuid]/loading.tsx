import { Skeleton } from '@/components/ui/skeleton';

export default function UserLoading() {
	return (
		<>
			<Skeleton className="h-5 w-1/3" />
			<div className="flex justify-between w-full items-center">
				<Skeleton className="h-10 w-max">A very cool title</Skeleton>
				<Skeleton className="h-7 w-max">As an admin, you can manage their files</Skeleton>
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full">
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-40 w-full" />
			</div>
		</>
	);
}
