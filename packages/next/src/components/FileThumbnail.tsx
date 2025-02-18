'use client';

import type { FileWithFileMetadataAndIndex } from '@/lib/atoms/fileDialog';
import { selectedFileAtom, isDialogOpenAtom } from '@/lib/atoms/fileDialog';
import { isFileImage, isFileVideo, isFileAudio, isFilePDF } from '@/lib/file';
import { cn } from '@/lib/utils';
import type { FilePropsType } from '@/types';
import { ENV } from '@/util/env';
import { useSetAtom } from 'jotai';
import { FileWarning, Video, FileAudio, FileText, FileIcon } from 'lucide-react';
import Image from 'next/image';
import { useState, type PropsWithChildren } from 'react';

const ComponentType = ({
	children,
	isTableView,
	file,
	type
}: PropsWithChildren<{
	readonly file?: FileWithFileMetadataAndIndex;
	readonly isTableView?: boolean;
	readonly type: FilePropsType;
}>) => {
	const setModalOpen = useSetAtom(isDialogOpenAtom);
	const setSelectedFile = useSetAtom(selectedFileAtom);

	return isTableView && file ? (
		<button
			type="button"
			className="flex flex-col justify-center items-center"
			onClick={e => {
				e.preventDefault();
				e.stopPropagation();

				if (file.quarantine && type !== 'quarantine') {
					return;
				}

				setSelectedFile(file);
				setModalOpen(true);
			}}
		>
			{children}
		</button>
	) : (
		<>{children}</>
	);
};

export const FileThumbnail = ({
	file,
	hoveredFiles = [],
	isTableView = false,
	type
}: {
	readonly file: FileWithFileMetadataAndIndex;
	readonly hoveredFiles?: string[];
	readonly isTableView?: boolean;
	readonly type: FilePropsType;
}) => {
	const [error, setError] = useState(false);

	return file.quarantine ? (
		<div className={cn('flex flex-col justify-center items-center', isTableView ? '' : 'h-40 bg-dark-90')}>
			<FileWarning className="text-red-500 w-16 h-16" />
		</div>
	) : (isFileImage(file) && !error) || (isFileVideo(file) && file.fileMetadata?.thumbnailWidth && !error) ? (
		<ComponentType isTableView={isTableView} file={file} type={type}>
			<Image
				unoptimized
				src={`${ENV.BASE_API_URL}/thumbnails/${file.identifier}.webp`}
				width={file.fileMetadata?.thumbnailWidth ?? 0}
				height={file.fileMetadata?.thumbnailHeight ?? 0}
				className="cursor-pointer w-full sm:min-w-[160px] min-w-0"
				alt={file.identifier}
				onError={() => setError(true)}
			/>

			{isFileVideo(file) && hoveredFiles.includes(file.uuid ?? file.identifier) && (
				<video
					className="preview absolute top-0 left-0 w-full h-full pointer-events-none sm:min-w-[160px] min-w-0"
					autoPlay
					loop
					muted
				>
					<source src={`${ENV.BASE_API_URL}/thumbnails/${file.identifier}.webm`} type="video/webm" />
				</video>
			)}

			{isFileVideo(file) && <Video className="absolute bottom-1 right-1 w-6 h-6 pointer-events-none" />}
		</ComponentType>
	) : (
		<div
			className={cn(
				'flex flex-col justify-center items-center cursor-pointer',
				isTableView ? '' : 'h-40 bg-dark-90'
			)}
		>
			<ComponentType isTableView={isTableView} file={file} type={type}>
				{isFileAudio(file) && <FileAudio className=" w-16 h-16" />}
				{isFilePDF(file) && <FileText className=" w-16 h-16" />}
				{!isFileAudio(file) && !isFilePDF(file) && <FileIcon className=" w-16 h-16" />}
				{file.fileMetadata?.originalFilename ? (
					<span className={cn('break-all w-[160px]', isTableView ? '' : 'mt-4 text-lg text-center')}>
						{file.fileMetadata.originalFilename.length > 60
							? `${file.fileMetadata.originalFilename.slice(0, 40)}...`
							: file.fileMetadata.originalFilename}
					</span>
				) : (
					<span className={cn('break-all w-[160px]', isTableView ? '' : 'mt-4 text-lg text-center')}>
						{file.identifier.length > 60 ? `${file.identifier.slice(0, 40)}...` : file.identifier}
					</span>
				)}
			</ComponentType>
		</div>
	);
};
