import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function StatisticsLoading() {
	return (
		<div className="px-2 flex flex-col gap-2 w-full">
			<Skeleton className="h-7 w-max">System</Skeleton>

			<Skeleton className="h-6 w-max">Platform: darwin arm64</Skeleton>
			<Skeleton className="h-6 w-max">Distro: macOS 14.5</Skeleton>
			<Skeleton className="h-6 w-max">Kernel: 23.5.0</Skeleton>
			<Skeleton className="h-6 w-max">CPU: 8 × Apple M1 @ 2.40GHz</Skeleton>
			<Skeleton className="h-6 w-max">Uptime: 33d 1h 38m 17s</Skeleton>

			<Separator className="my-4" />
			<Skeleton className="h-[60px] w-full" />
			<Separator className="my-4" />
			<Skeleton className="h-[60px] w-full" />
			<Separator className="my-4" />

			<Skeleton className="h-7 w-max">File systems</Skeleton>

			<Skeleton className="h-16 w-full" />
			<Skeleton className="h-16 w-full" />
			<Skeleton className="h-16 w-full" />

			<Separator className="my-4" />

			<Skeleton className="h-7 w-max">chibisafe</Skeleton>

			<Skeleton className="h-6 w-max">Memory usage: 60 MB</Skeleton>
			<Skeleton className="h-6 w-max">Uptime: 0d 4h 27m 11s</Skeleton>
			<Skeleton className="h-40 w-full" />
		</div>
	);
}
