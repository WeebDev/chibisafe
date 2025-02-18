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
import { InvitesConfirmationAction } from './InvitesConfirmationAction';
import Link from 'next/link';
import { getDate, isValidDate } from '@/lib/time';
import type { components } from '@/util/openapiSchema';

type Invite = components['schemas']['UserInvite'] & {
	invitee: components['schemas']['User'] | null;
	user: components['schemas']['User'] | null;
};

const columnHelper = createColumnHelper<Invite>();
const columns = [
	columnHelper.accessor(row => row.identifier, {
		id: 'code',
		header: 'Code',
		cell(props) {
			return (
				<Link href={`/invite/${props.row.original.identifier}`} className="link">
					{props.row.original.identifier}
				</Link>
			);
		}
	}),
	columnHelper.accessor(row => (row.invitee?.uuid ? 'Used' : 'Available'), {
		id: 'status',
		header: 'Status'
	}),
	columnHelper.accessor(row => row.user, {
		id: 'createdBy',
		header: 'Created By',
		cell(props) {
			return (
				<Link href={`/dashboard/admin/users/${props.row.original.user!.uuid}`} className="link">
					{props.row.original.user!.username}
				</Link>
			);
		}
	}),
	columnHelper.accessor(row => getDate(row.createdAt as string), {
		id: 'createdAt',
		header: 'Created At'
	}),
	columnHelper.accessor(row => row.invitee, {
		id: 'claimedBy',
		header: 'Claimed By',
		cell(props) {
			return props.row.original.invitee?.uuid ? (
				<Link href={`/dashboard/admin/users/${props.row.original.invitee.uuid}`} className="link">
					{props.row.original.invitee.username}
				</Link>
			) : (
				'N/A'
			);
		}
	}),
	columnHelper.accessor(row => (isValidDate(row.editedAt) ? getDate(row.editedAt as string) : 'N/A'), {
		id: 'claimedAt',
		header: 'Claimed At'
	}),
	columnHelper.display({
		id: 'actions',
		header: '',
		cell: props =>
			props.row.original.invitee?.uuid ? null : (
				<div className="flex justify-end">
					<InvitesConfirmationAction code={props.row.original.uuid} />
				</div>
			)
	})
];

export const InvitesTable = ({ data = [] }: PropsWithChildren<{ readonly data?: Invite[] }>) => {
	console.log(data);
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
