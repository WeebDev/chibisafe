import { Skeleton } from '@/components/ui/skeleton';
import { getDate } from '@/lib/time';
import { Trash2Icon } from 'lucide-react';

export default function AlbumLoading() {
	return (
		<>
			<Skeleton className="h-5 w-1/3" />
			<div className="flex justify-between w-full items-center">
				<div className="flex flex-col gap-4">
					<Skeleton className="h-10 w-max">A very cool title</Skeleton>
					<Skeleton className="h-7 w-max">{getDate(new Date().toISOString())}</Skeleton>
				</div>
				<Skeleton className="h-10 w-max py-2 px-4">
					<Trash2Icon className="mr-2 h-4 w-4" />
					Delete
				</Skeleton>
			</div>
			<Skeleton className="h-36 w-full" />
		</>
	);
}
