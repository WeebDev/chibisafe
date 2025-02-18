'use client';

import type { DropEvent } from '@react-types/shared';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import type { DropZoneProps } from 'react-aria-components';
import { globalDropZoneOpenAtom } from '@/lib/atoms/dropzone';
import { DropZone } from '@/components/ui/dropzone';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { settingsAtom } from '@/lib/atoms/settings';
import { toast } from 'sonner';
import { getSignedUrl, processDropItem } from '@/lib/dropzone';
import { useUploadFile } from '@/hooks/useUploadFile';
import { uploadQueue } from '@/lib/uploadQueue';

interface DropZonePropsWithAlbumUuid extends DropZoneProps {
	readonly albumUuid?: string;
}

export const GlobalDropZone = (props: DropZonePropsWithAlbumUuid) => {
	const { className, children, ...additionalProps } = props;

	const ref = useRef<HTMLDivElement>(null);
	const [globalDropZoneOpen, setGlobalDropZoneOpen] = useAtom(globalDropZoneOpenAtom);

	const settings = useAtomValue(settingsAtom);

	const { uploadFile } = useUploadFile({ albumUuid: props.albumUuid });

	const onDrop = useCallback(
		async (ev: DropEvent) => {
			for (const item of ev.items) {
				const files = await processDropItem(item, settings);
				if (!files.length) continue;

				if (!settings?.useNetworkStorage) {
					files.map(async file =>
						uploadQueue.add(async () =>
							uploadFile({
								file: file instanceof File ? file : await file.getFile(),
								endpoint: `api/v1/upload`,
								isNetworkStored: false,
								method: 'POST'
							})
						)
					);

					continue;
				}

				files.map(async file => {
					uploadQueue.add(async () => {
						const actualFile = file instanceof File ? file : await file.getFile();
						const { url, identifier, publicUrl, error } = await getSignedUrl(actualFile);
						if (error) {
							toast.error(error);
							return;
						}

						await uploadFile({
							file: actualFile,
							endpoint: url,
							isNetworkStored: true,
							method: 'PUT',
							identifier,
							publicUrl
						});
					});
				});
			}
		},
		[settings, uploadFile]
	);

	const onPaste = useCallback(
		async (ev: ClipboardEvent) => {
			const items = ev.clipboardData?.items;
			if (!items) return;

			for (const item of items) {
				const file = item.getAsFile();
				if (!file) continue;

				const files = await processDropItem(file, settings);
				if (!files.length) continue;

				if (!settings?.useNetworkStorage) {
					files.map(async file =>
						uploadQueue.add(async () =>
							uploadFile({
								file: file instanceof File ? file : await file.getFile(),
								endpoint: 'api/v1/upload',
								isNetworkStored: false,
								method: 'POST'
							})
						)
					);

					continue;
				}

				files.map(async file => {
					uploadQueue.add(async () => {
						const actualFile = file instanceof File ? file : await file.getFile();
						const { url, identifier, publicUrl, error } = await getSignedUrl(actualFile);
						if (error) {
							toast.error(error);
							return;
						}

						await uploadFile({
							file: actualFile,
							endpoint: url,
							isNetworkStored: true,
							method: 'PUT',
							identifier,
							publicUrl
						});
					});
				});
			}
		},
		[settings, uploadFile]
	);

	useEffect(() => {
		const dragEnterHandler = (ev: DragEvent) => {
			if (ev.dataTransfer?.types.includes('Files')) {
				setGlobalDropZoneOpen(true);
			}
		};

		window.addEventListener('dragenter', dragEnterHandler);
		window.addEventListener('paste', onPaste);

		return () => {
			window.removeEventListener('dragenter', dragEnterHandler);
			window.removeEventListener('paste', onPaste);
		};
	}, [onPaste, setGlobalDropZoneOpen]);

	return (
		<DropZone
			{...additionalProps}
			className={cn(
				'fixed inset-0 z-50 p-4 transition-all',
				globalDropZoneOpen
					? 'duration-250 visible opacity-100 fade-in'
					: 'duration-250 invisible opacity-0 fade-out',
				className
			)}
			onDrop={onDrop}
			onDropExit={() => setGlobalDropZoneOpen(false)}
			ref={ref}
		>
			<AnimatePresence>
				{globalDropZoneOpen ? (
					<div className="global-dropzone-border h-full w-full rounded-xl p-px">
						<div className="relative h-full w-full rounded-xl global-dropzone-backdrop flex flex-col justify-center items-center">
							<div className="relative flex flex-row justify-center items-center pointer-events-none select-none">
								<motion.div
									animate={{ opacity: 1, y: 0 }}
									className=""
									exit={{ y: 50, opacity: 0 }}
									initial={{ y: 50, opacity: 0 }}
									key="bottom-banner-outer"
									transition={{ duration: 0.25 }}
								>
									<motion.div
										animate={{ y: [10, -10] }}
										className=" flex items-center gap-2 rounded-lg px-6 py-5"
										key="bottom-banner-inner"
										transition={{
											delay: 0.25,
											duration: 0.75,
											repeat: Number.POSITIVE_INFINITY,
											repeatType: 'reverse'
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="3em"
											height="3em"
											viewBox="0 0 256 256"
										>
											<path
												fill="currentColor"
												d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m37.66 101.66a8 8 0 0 1-11.32 0L136 107.31V168a8 8 0 0 1-16 0v-60.69l-18.34 18.35a8 8 0 0 1-11.32-11.32l32-32a8 8 0 0 1 11.32 0l32 32a8 8 0 0 1 0 11.32"
											/>
										</svg>
										{/* <ArrowUpCircle className="h-12 w-12" strokeWidth={1} /> */}
									</motion.div>
								</motion.div>
								<p className="border-l border-white pl-4 text-sm">
									Drop your files here
									<br />
									to upload them
								</p>
							</div>
						</div>
					</div>
				) : null}
			</AnimatePresence>
		</DropZone>
	);
};
