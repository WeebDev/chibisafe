import type { Metadata } from 'next';

import { cookies } from 'next/headers';
import request from '@/lib/request';
import type { PageQuery, Snippet } from '@/types';
import { SnippetViewer } from '@/components/SnippetViewer';
import { redirect } from 'next/navigation';
import { Pagination } from '@/components/Pagination';

export const metadata: Metadata = {
	title: 'Dashboard - Snippets'
};

export default async function DashboardSnippetsPage({ searchParams }: { readonly searchParams: PageQuery }) {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;
	if (!token) redirect('/');

	const currentPage = searchParams.page ?? 1;
	const perPage = searchParams.limit ? (searchParams.limit > 50 ? 50 : searchParams.limit) : 50;
	const search = searchParams.search ?? '';

	const {
		data: response,
		error,
		status
	} = await request.get({
		url: `snippets`,
		query: {
			page: currentPage,
			limit: perPage,
			search
		},
		headers: {
			authorization: `Bearer ${token}`
		},
		options: {
			next: {
				tags: ['snippets']
			}
		}
	});

	if (error && status === 401) {
		redirect('/login');
	}

	return (
		<div className="px-2 w-full">
			<Pagination itemsTotal={response?.count} />
			<div className="flex flex-col gap-6 mt-8">
				{response?.snippets.map((snippet: Snippet) => {
					return <SnippetViewer snippet={snippet} maxLines={10} />;
				})}
			</div>
		</div>
	);
}
