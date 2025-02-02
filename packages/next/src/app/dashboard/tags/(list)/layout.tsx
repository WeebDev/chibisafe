import { DashboardHeader } from '@/components/DashboardHeader';
import { CreateTagDialog } from '@/components/dialogs/CreateTagDialog';
import type { PropsWithChildren } from 'react';

export default async function TagsLayout({ children }: PropsWithChildren) {
	return (
		<>
			<DashboardHeader title="Tags" subtitle="Manage and create tags">
				<CreateTagDialog />
			</DashboardHeader>
			{children}
		</>
	);
}
