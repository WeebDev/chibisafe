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
import { DataTable } from '../DataTable';
import type { components } from '@/util/openapiSchema';
import Link from 'next/link';
import { DeleteCollaboratorButton } from './DeleteCollaboratorButton';

type AlbumCollaborator = components['schemas']['Collaborator'];

const columnHelper = createColumnHelper<AlbumCollaborator>();
const columns = [
	columnHelper.display({
		id: 'user',
		header: 'User',
		cell: props => (
			<Link
				href={`/dashboard/admin/users/${props.row.original.user?.uuid}`}
				className="link inline-flex items-center ml-2"
			>
				{props.row.original.user?.username}
			</Link>
		)
	}),
	columnHelper.display({
		id: 'actions',
		header: '',
		cell: props => (
			<div className="flex justify-end">
				<DeleteCollaboratorButton
					uuid={props.row.original.user?.uuid ?? ''}
					albumUuid={props.table.options.meta!.albumUuid!}
				/>
			</div>
		)
	})
];

export const AlbumCollaboratorsTable = ({
	data = [],
	albumUuid
}: PropsWithChildren<{ readonly albumUuid: string; readonly data?: AlbumCollaborator[] | undefined }>) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

	console.log(data);
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
