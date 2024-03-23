'use client';

import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table';
import { useState, type PropsWithChildren } from 'react';
import { ArrowUpRightFromSquare, Trash2Icon } from 'lucide-react';
import { Button } from '../../ui/button';
import { DataTable } from '../DataTable';
import Link from 'next/link';
import type { AlbumLink } from '@/types';
import { AlbumLinksConfirmationAction } from './AlbumLinksConfirmationAction';
import { AlbumLinksToggleAction } from './AlbumLinksToggleAction';

const columnHelper = createColumnHelper<AlbumLink>();
const columns = [
	columnHelper.accessor(row => row.views, {
		id: 'views',
		header: 'Views'
	}),
	columnHelper.display({
		id: 'link',
		header: 'Link',
		cell: props => (
			<Link href={`/a/${props.row.original.identifier}`} className="link inline-flex items-center">
				{props.row.original.identifier} <ArrowUpRightFromSquare className="w-3 h-3 ml-1" />
			</Link>
		)
	}),
	columnHelper.display({
		id: 'enabled',
		header: 'Enabled',
		cell: props => (
			<AlbumLinksToggleAction
				key={props.row.original.uuid}
				uuid={props.row.original.uuid}
				albumUuid={props.row.original.albumUuid}
				initialEnabled={props.row.original.enabled}
			/>
		)
	}),
	columnHelper.display({
		id: 'actions',
		header: '',
		cell: props => (
			<div className="flex justify-end">
				<AlbumLinksConfirmationAction
					uuid={props.row.original.uuid}
					albumUuid={props.row.original.albumUuid}
					description="Are you sure you want to delete this link?"
				>
					<Button variant="outline" size={'icon'}>
						<Trash2Icon className="h-4 w-4" />
					</Button>
				</AlbumLinksConfirmationAction>
			</div>
		)
	})
];

export const AlbumLinksTable = ({ data = [] }: PropsWithChildren<{ readonly data?: any | undefined }>) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility
		}
	});

	return <DataTable table={table} columns={columns} />;
};
