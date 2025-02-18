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
import { ArrowUpRightFromSquare } from 'lucide-react';
import { DataTable } from '@/components/tables/DataTable';
import { DeleteLinkButton } from '@/components/tables/album-links-table/DeleteLinkButton';

type AlbumLink = {
	identifier: string;
	uuid: string;
};

const columnHelper = createColumnHelper<AlbumLink>();
const columns = [
	columnHelper.display({
		id: 'link',
		header: 'Link',
		cell: props => (
			<a href={`/a/${props.row.original.identifier}`} target="_blank" className="link inline-flex items-center">
				{props.row.original.identifier} <ArrowUpRightFromSquare className="w-3 h-3 ml-1" />
			</a>
		)
	}),
	columnHelper.display({
		id: 'actions',
		header: '',
		cell: props => (
			<div className="flex justify-end">
				<DeleteLinkButton uuid={props.row.original.uuid} albumUuid={props.table.options.meta!.albumUuid!} />
			</div>
		)
	})
];

export const AlbumLinksTable = ({
	data = [],
	albumUuid
}: PropsWithChildren<{ readonly albumUuid: string; readonly data?: AlbumLink[] | undefined }>) => {
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
		},
		meta: {
			albumUuid
		}
	});

	return <DataTable table={table} columns={columns} />;
};
