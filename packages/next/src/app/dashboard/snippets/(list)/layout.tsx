import { DashboardHeader } from '@/components/DashboardHeader';
import { CreateSnippetDialog } from '@/components/dialogs/CreateSnippetDialog';
import { CreateSnippetDrawer } from '@/components/drawers/CreateSnippetDrawer';
import type { PropsWithChildren } from 'react';

export default async function SnippetsLayout({ children }: PropsWithChildren) {
	return (
		<>
			<DashboardHeader title="Snippets" subtitle="Manage and create snippets">
				<CreateSnippetDialog className="hidden md:inline-flex" />
				<CreateSnippetDrawer className="inline-flex md:hidden" />
			</DashboardHeader>
			{children}
		</>
	);
}
