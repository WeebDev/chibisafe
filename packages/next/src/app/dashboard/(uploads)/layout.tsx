import { DashboardHeader } from '@/components/DashboardHeader';
import { Button } from '@/components/ui/react-aria-button';
import { UploadTrigger } from '@/components/UploadTrigger';
import { buttonVariants } from '@/styles/button';
import { Plus } from 'lucide-react';
import type { PropsWithChildren } from 'react';

export default function UploadsLayout({ children }: PropsWithChildren) {
	return (
		<>
			<DashboardHeader title="Uploads" subtitle="Manage your uploads">
				<UploadTrigger allowsMultiple>
					<Button className={buttonVariants()}>
						<Plus className="mr-2 h-4 w-4" />
						Upload file
					</Button>
				</UploadTrigger>
			</DashboardHeader>
			{children}
		</>
	);
}
