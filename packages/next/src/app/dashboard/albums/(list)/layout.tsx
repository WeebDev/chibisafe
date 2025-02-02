import { DashboardHeader } from '@/components/DashboardHeader';
import { CreateAlbumDialog } from '@/components/dialogs/CreateAlbumDialog';

export default function AlbumsLayout({ children }: any) {
	return (
		<>
			<DashboardHeader title="Albums" subtitle="Manage and create albums">
				<CreateAlbumDialog />
			</DashboardHeader>
			{children}
		</>
	);
}
