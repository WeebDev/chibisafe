'use client';
/* eslint-disable @next/next/no-img-element */

import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table';
import { useState, type PropsWithChildren } from 'react';
import type { FilePropsType, FileWithIndex } from '@/types';
import { ArrowDownToLineIcon, ArrowUpDown, ArrowUpRightFromSquare } from 'lucide-react';
import { Button } from '../../ui/button';
import { DataTable } from '../DataTable';
import { FileInformationDialogActions } from '@/components/FileInformationDialogActions';
import { formatBytes } from '@/lib/file';
import { FileThumbnail } from '@/components/FileThumbnail';
import Link from 'next/link';
import { ENV } from '@/util/env';

const columnHelper = createColumnHelper<FileWithIndex>();
const columns = [
	columnHelper.accessor(row => row.identifier, {
		id: 'thumbnail',
		header: 'Preview',
		cell: props => (
			<FileThumbnail file={props.row.original} isTableView type={props.table.options.meta?.type ?? 'uploads'} />
		)
	}),
	columnHelper.accessor(row => row.filename, {
		id: 'link',
		header: 'Link',
		cell: props => (
			<a
				href={`${ENV.BASE_API_URL}/${props.row.original.filename}`}
				className="text-blue-500 underline inline-flex items-center"
			>
				{props.row.original.filename} <ArrowUpRightFromSquare className="w-3 h-3 ml-1" />
			</a>
		)
	}),
	columnHelper.accessor(row => row.fileMetadata.originalFilename, {
		id: 'original',
		header: 'Original',
		cell: props => (
			<a
				href={`${ENV.BASE_API_URL}/api/v1/files/${props.row.original.uuid}/download`}
				className="text-blue-500 underline inline-flex items-center break-all"
			>
				{props.row.original.fileMetadata.originalFilename} <ArrowDownToLineIcon className="w-4 h-4 ml-1" />
			</a>
		)
	}),
	// TODO: Not implemented yet
	// columnHelper.accessor(row => row.user, {
	// 	id: 'user',
	// 	header: 'Owner',
	// 	enableHiding: true,
	// 	cell: props => {
	// 		if (props.table.options.meta?.type !== 'admin') {
	// 			props.column.toggleVisibility(false);
	// 			return;
	// 		}

	// 		return (
	// 			<Link
	// 				href={`/dashboard/admin/users/${props.row.original.user?.uuid}`}
	// 				className="text-blue-500 underline inline-flex items-center"
	// 			>
	// 				{props.row.original.user?.username}
	// 			</Link>
	// 		);
	// 	}
	// }),
	columnHelper.accessor(row => row.fileMetadata.size, {
		id: 'size',
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Size
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: props => <span>{formatBytes(props.getValue())}</span>
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
		cell: props => <span>{new Date(props.getValue()).toLocaleDateString()}</span>
	}),
	columnHelper.display({
		id: 'actions',
		header: '',
		cell: props => (
			<FileInformationDialogActions
				file={props.row.original}
				type={props.table.options.meta?.type ?? 'uploads'}
			/>
		)
	})
];

export const FilesTable = ({
	data = [],
	type
}: PropsWithChildren<{ readonly data?: any | undefined; readonly type: FilePropsType }>) => {
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
			type
		}
	});

	return <DataTable table={table} columns={columns} />;
};
