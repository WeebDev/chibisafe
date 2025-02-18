import { AlbumMasonry } from '@/components/AlbumMasonry';
import { Pagination } from '@/components/Pagination';
import { openAPIClient } from '@/lib/serverFetch';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function AlbumPage({
	page,
	limit,
	search
}: {
	readonly limit: number;
	readonly page: number;
	readonly search: string;
}) {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;
	if (!token) redirect('/');

	const { data, response } = await openAPIClient.GET('/api/v1/folders', {
		params: {
			query: {
				offset: page - 1,
				limit,
				search
			}
		}
	});

	if (response.status === 401) {
		redirect('/login');
	}

	return (
		<>
			<Pagination itemsTotal={data?.count} />
			<AlbumMasonry albums={data?.results} />
		</>
	);
}
