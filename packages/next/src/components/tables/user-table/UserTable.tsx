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
import { formatBytes } from '@/lib/file';
import { Badge } from '../../ui/badge';
import { UserTableActions } from './UserTableActions';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '../../ui/button';
import { DataTable } from '../DataTable';
import Link from 'next/link';
import type { UserWithRolesAndQuota } from '@/types';

const columnHelper = createColumnHelper<UserWithRolesAndQuota>();
const columns = [
	columnHelper.accessor(row => row.username, {
		id: 'username',
		header: 'Username',
		cell: props => (
			<Link
				href={`/dashboard/admin/users/${props.row.original.uuid}`}
				className="link inline-flex items-center ml-2"
			>
				{props.row.original.username}
			</Link>
		)
	}),
	columnHelper.accessor(row => row.filesCount, {
		id: 'files',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Files
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		}
	}),
	columnHelper.accessor(row => (row.enabled ? 'Enabled' : 'Disabled'), {
		id: 'status',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Status
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		}
	}),
	columnHelper.accessor(row => row.roles, {
		id: 'roles',
		header: 'Roles',
		cell: props => (
			<div className="flex gap-2">
				{props.getValue().map((role: any) => (
					<Badge key={role.name}>{role.name}</Badge>
				))}
			</div>
		)
	}),
	columnHelper.accessor(row => row.storageQuotaUsed, {
		id: 'used',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Used
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: props => <span>{formatBytes(props.getValue())}</span>
	}),
	columnHelper.accessor(row => (row.storageQuota === -1 ? 'Unlimited' : formatBytes(row.storageQuota)), {
		id: 'limit',
		header: 'Limit'
	}),
	columnHelper.accessor(row => row.createdAt, {
		id: 'created',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Created
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: props => <span>{new Date(props.getValue().toString()).toLocaleDateString()}</span>
	}),
	columnHelper.display({
		id: 'actions',
		header: '',
		cell: props => <UserTableActions user={props.row.original} />
	})
];

export const UserTable = ({ data = [] }: PropsWithChildren<{ readonly data?: any | undefined }>) => {
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
