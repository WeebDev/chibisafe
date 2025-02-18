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
import Link from 'next/link';
import type { Role } from '@/types';
import { RolesTableActions } from './RolesTableActions';
import { formatBytes } from '@/lib/file';

const columnHelper = createColumnHelper<Role>();
const columns = [
	columnHelper.display({
		id: 'name',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: props => (
			<Link
				href={`/dashboard/admin/roles/${props.row.original.uuid}`}
				className="link inline-flex items-center ml-2"
			>
				{props.row.original.name}
			</Link>
		)
	}),
	columnHelper.accessor(row => row.storageQuota, {
		id: 'storageQuota',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Allocated storage
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: props => <span>{props.getValue() === -1 ? 'Unlimited' : formatBytes(props.getValue())}</span>
	}),
	columnHelper.accessor(row => row.permissions, {
		id: 'permissions',
		header: 'Permissions',
		cell: props =>
			props.getValue() ? (
				<ul>
					{Object.entries(props.getValue()).map(([key, value]) => (
						<li key={key} className={value ? 'text-green-700' : 'text-red-700'}>
							{key}: {String(value)}
						</li>
					))}
				</ul>
			) : (
				<span>No permissions set</span>
			)
	}),
	columnHelper.display({
		id: 'actions',
		header: '',
		cell: props => (
			<div className="flex justify-end">
				<RolesTableActions role={props.row.original} />
			</div>
		)
	})
];

export const RolesTable = ({ data = [] }: PropsWithChildren<{ readonly data: Role[] }>) => {
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
