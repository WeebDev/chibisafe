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
import { ArrowUpDown } from 'lucide-react';
import { Button } from '../../ui/button';
import { DataTable } from '../DataTable';
import { IpTableActions } from './IpTableActions';
import Link from 'next/link';
import { getDate } from '@/lib/time';
import type { components } from '@/util/openapiSchema';

type IP = components['schemas']['IPBan'];

const columnHelper = createColumnHelper<IP>();
const columns = [
	columnHelper.display({
		id: 'ip',
		header: 'IP',
		cell: props => (
			<Link
				href={`/dashboard/admin/bans/${props.row.original.uuid}`}
				className="link inline-flex items-center ml-2"
			>
				{props.row.original.ip}
			</Link>
		)
	}),
	columnHelper.accessor(row => row.createdAt, {
		id: 'created',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Added on
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: props => <span>{getDate(props.getValue())}</span>
	}),
	columnHelper.accessor(row => row.reason, {
		id: 'reason',
		header: 'Reason'
	}),
	columnHelper.display({
		id: 'actions',
		header: '',
		cell: props => (
			<div className="flex justify-end">
				<IpTableActions ip={props.row.original.ip} uuid={props.row.original.uuid} />
			</div>
		)
	})
];

export const IpTable = ({ data = [] }: PropsWithChildren<{ readonly data: IP[] }>) => {
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
