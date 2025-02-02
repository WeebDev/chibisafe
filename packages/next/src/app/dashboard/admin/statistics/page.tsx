import type { Metadata } from 'next';

import { cookies } from 'next/headers';
import request from '@/lib/request';
import { CategoryBar, DonutChart, Legend, ProgressCircle } from '@/components/Statistics';
import { Separator } from '@/components/ui/separator';
import { formatBytes } from '@/lib/file';
import { InfoIcon } from 'lucide-react';
import { Tooltip } from '@/components/Tooltip';
import { getDate, getUptime } from '@/lib/time';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Stats'
};

export default async function DashboardAdminStatsPage() {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;

	const {
		data: response,
		error,
		status
	} = await request.get({
		url: `admin/service/statistics`,
		headers: {
			authorization: `Bearer ${token}`
		},
		options: {
			next: {
				tags: ['me']
			}
		}
	});

	if (error && status === 401) {
		redirect('/login');
	}

	const statistics = response.statistics;

	const CPULoad = Number.parseFloat(statistics[0]?.system['CPU Load']);
	const memory = statistics[0]?.system?.Memory;
	const uptime = getUptime(statistics[0].system.Uptime.value);
	const chibisafeMemory = statistics[1]?.service?.['Memory Usage'];
	const chibisafeUptime = getUptime(statistics[1].service.Uptime.value);

	const systemGeneratedOn = getDate(statistics[0]?.system?.meta.generatedOn);
	const serviceGeneratedOn = getDate(statistics[1]?.service?.meta.generatedOn);
	const fileSystemsGeneratedOn = getDate(statistics[2]?.service?.meta.generatedOn);

	const fileSystems = statistics[2]?.fileSystems;
	const uploads = Object.keys(statistics[3].uploads)
		.filter(name => name !== 'meta' && name !== 'sizeInDB' && name !== 'Total')
		.map(name => {
			return { name, value: statistics[3].uploads[name] };
		});
	const totalUploadsSize = formatBytes(statistics[3].uploads.sizeInDB);

	return (
		<div className="px-2 flex flex-col gap-2 w-full">
			<h2 className="text-xl font-extrabold flex items-center gap-2">
				System{' '}
				<Tooltip content={`Generated on: ${systemGeneratedOn}`}>
					<InfoIcon className="h-4 w-4" />
				</Tooltip>
			</h2>
			<div>
				<p>Platform: {statistics[0]?.system?.Platform}</p>
				<p>Distro: {statistics[0]?.system?.Distro}</p>
				<p>Kernel: {statistics[0]?.system?.Kernel}</p>
				<p>CPU: {statistics[0]?.system?.CPU}</p>
				<p>Uptime: {uptime}</p>
			</div>

			<Separator className="my-4" />

			<div>
				<p className="flex items-center justify-between">
					<span>CPU Load</span>
					<span>{CPULoad}%</span>
				</p>
				<CategoryBar
					values={[40, 30, 20, 10]}
					colors={['emerald', 'yellow', 'orange', 'rose']}
					markerValue={CPULoad}
				/>
			</div>

			<Separator className="my-4" />

			<div>
				<p className="flex items-center justify-between">
					<span>Memory usage</span>
					<span>
						{formatBytes(memory.value.used)} / {formatBytes(memory.value.total)}
					</span>
				</p>
				<CategoryBar
					values={[40, 30, 20, 10]}
					colors={['emerald', 'yellow', 'orange', 'rose']}
					markerValue={(memory.value.used / memory.value.total) * 100}
				/>
			</div>

			<Separator className="my-4" />

			<h2 className="text-xl font-extrabold flex items-center gap-2">
				File systems{' '}
				<Tooltip content={`Generated on: ${fileSystemsGeneratedOn}`}>
					<InfoIcon className="h-4 w-4" />
				</Tooltip>
			</h2>

			<div className="flex justify-start items-center mt-4 flex-wrap gap-4">
				{Object.keys(fileSystems).map(fileSystem => {
					if (fileSystem === 'meta') return null;
					const { total, used } = fileSystems[fileSystem].value;
					const percentageUsed = Math.ceil((used / total) * 100);
					return (
						<div key={fileSystem} className="flex flex-row justify-center items-center gap-4">
							<ProgressCircle value={percentageUsed} size="md">
								<span className="text-xs font-medium text-slate-700">{percentageUsed}%</span>
							</ProgressCircle>
							<div>
								<p className="text-tremor-default text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
									{formatBytes(used)}/{formatBytes(total)} ({percentageUsed}%)
								</p>
								<p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
									{fileSystem}
								</p>
							</div>
						</div>
					);
				})}
			</div>

			<Separator className="my-4" />

			<h2 className="text-xl font-extrabold flex items-center gap-2">
				chibisafe{' '}
				<Tooltip content={`Generated on: ${serviceGeneratedOn}`}>
					<InfoIcon className="h-4 w-4" />
				</Tooltip>
			</h2>
			<div>
				<p>Memory usage: {formatBytes(chibisafeMemory.value)}</p>
				<p>Uptime: {chibisafeUptime}</p>
			</div>
			<div className="flex items-center gap-6 mt-4">
				<DonutChart
					data={uploads}
					category="value"
					index="name"
					colors={['blue', 'cyan', 'indigo']}
					className="w-40"
				/>
				<div className="flex flex-col justify-center items-center">
					<Legend
						categories={['Images', 'Videos', 'Others']}
						colors={['blue', 'cyan', 'indigo']}
						className="max-w-xs"
					/>
					<p className="text-sm text-muted-foreground">Total size in uploads: {totalUploadsSize}</p>
				</div>
			</div>
		</div>
	);
}
