'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
	MediaControlBar,
	MediaController,
	MediaFullscreenButton,
	MediaMuteButton,
	MediaPipButton,
	MediaPlaybackRateButton,
	MediaPlayButton,
	MediaTimeDisplay,
	MediaTimeRange,
	MediaVolumeRange
} from 'media-chrome/dist/react';

import { isFileAudio, isFileImage, isFileVideo } from '@/lib/file';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Loader2Icon } from 'lucide-react';
import { useAtom, useAtomValue } from 'jotai';
import { currentTypeAtom, isDialogOpenAtom, selectedFileAtom, allFilesAtom } from '@/lib/atoms/fileDialog';
import { FileTextViewer } from '../FileTextViewer';
import { useEventListener } from 'usehooks-ts';
import { useZoomImageWheel } from '@zoom-image/react';
import { FileDialogToolbar } from '../FileDialogToolbar';
import { ENV } from '@/util/env';

export function FileDialog() {
	const [selectedFile, setSelectedFile] = useAtom(selectedFileAtom);
	const allFiles = useAtomValue(allFilesAtom);
	const currentType = useAtomValue(currentTypeAtom);
	const [isModalOpen, setModalOpen] = useAtom(isDialogOpenAtom);
	const [touchStart, setTouchStart] = useState<Number | null>(null);
	const [touchEnd, setTouchEnd] = useState<Number | null>(null);
	const [loading, setLoading] = useState(true);
	const imageZoomContainerRef = useRef<HTMLDivElement>(null);
	const { createZoomImage, setZoomImageState } = useZoomImageWheel();

	const swipeDistanceToTrigger = 50;

	const onOpenChange = useCallback(
		(open: boolean) => {
			if (open) return;

			setModalOpen(open);
			setSelectedFile(null);
		},
		[setModalOpen, setSelectedFile]
	);

	const findPreviousFile = useCallback(() => {
		const previousIndex = (selectedFile?.index ?? 0) - 1;
		const newItem = allFiles?.at(previousIndex);
		if (selectedFile?.index !== 0 && newItem) {
			setSelectedFile(newItem);
			setLoading(true);
		}
	}, [selectedFile?.index, allFiles, setSelectedFile]);

	const findNextFile = useCallback(() => {
		const nextIndex = (selectedFile?.index ?? 0) + 1;
		const newItem = allFiles?.at(nextIndex);
		if (selectedFile?.index !== (allFiles?.length ?? 0) - 1 && newItem) {
			setSelectedFile(newItem);
			setLoading(true);
		}
	}, [selectedFile?.index, allFiles, setSelectedFile]);

	const onTouchStart = useCallback((e: any) => {
		setTouchEnd(null);
		setTouchStart(e.targetTouches?.[0]?.clientX ?? 0);
	}, []);

	const onTouchMove = useCallback((e: any) => setTouchEnd(e.targetTouches?.[0]?.clientX ?? 0), []);

	const onTouchEnd = useCallback(() => {
		if (!touchStart || !touchEnd) return;
		const distance = Number(touchStart) - Number(touchEnd);
		const isLeftSwipe = distance > swipeDistanceToTrigger;
		const isRightSwipe = distance < -swipeDistanceToTrigger;

		if (isLeftSwipe) {
			findNextFile();
		} else if (isRightSwipe) {
			findPreviousFile();
		}
	}, [touchStart, touchEnd, findNextFile, findPreviousFile]);

	const finishedLoading = useCallback(() => {
		setLoading(false);
		setZoomImageState({ currentZoom: 1 });
	}, [setZoomImageState]);

	useEventListener('keydown', event => {
		event.stopPropagation();

		if (!selectedFile) {
			return;
		}

		if (event.key === 'ArrowLeft') {
			findPreviousFile();
		} else if (event.key === 'ArrowRight') {
			findNextFile();
		}
	});

	useEffect(() => {
		if (isModalOpen && imageZoomContainerRef.current) {
			createZoomImage(imageZoomContainerRef.current, { dblTapAnimationDuration: 150 });
		}
	}, [isModalOpen, createZoomImage]);

	return selectedFile && currentType ? (
		<Dialog open={isModalOpen} onOpenChange={onOpenChange}>
			<DialogContent
				className={cn(
					'h-[calc(100dvh-6rem)] md:w-[calc(100vw-6rem)] md:h-[calc(100dvh-6rem)] max-w-none bg-transparent border-none shadow-none p-0 flex justify-center items-center !pointer-events-none'
				)}
			>
				<FileDialogToolbar file={selectedFile} type={currentType} />

				<div
					className={cn(
						'w-max max-w-screen lg:max-w-[calc(100vw-8rem)] p-0 min-w-60 !pointer-events-auto flex items-center',
						'max-h-screen h-[inherit]'
					)}
					onTouchStart={onTouchStart}
					onTouchMove={onTouchMove}
					onTouchEnd={onTouchEnd}
				>
					<button
						type="button"
						aria-label="Previous"
						className="absolute top-[calc(50%-12px)] -left-6 hidden lg:inline-block"
						onClick={() => findPreviousFile()}
					>
						<ChevronLeft className="w-6 h-6" />
					</button>
					<button
						type="button"
						aria-label="Next"
						className="absolute top-[calc(50%-12px)] -right-6 hidden lg:inline-block"
						onClick={() => findNextFile()}
					>
						<ChevronRight className="w-6 h-6" />
					</button>
					{isFileImage(selectedFile) ? (
						<>
							<div
								className={cn(
									'h-full w-full absolute top-0 left-0 bg-black/50 select-none pointer-events-none z-10',
									{
										hidden: !loading
									}
								)}
							>
								<Loader2Icon className="absolute top-1/2 left-1/2 w-8 h-8 -ml-4 -mt-4 animate-spin" />
							</div>
							<picture
								className="flex items-center justify-center h-[inherit]"
								ref={imageZoomContainerRef}
							>
								<img
									src={`${ENV.BASE_API_URL}/${selectedFile.filename}`}
									className="max-h-full object-contain md:block"
									draggable={false}
									fetchPriority="high"
									onLoad={() => finishedLoading()}
									onError={() => setLoading(false)}
								/>
							</picture>
						</>
					) : isFileVideo(selectedFile) ? (
						<MediaController className="h-full w-full">
							<video
								slot="media"
								src={`${ENV.BASE_API_URL}/${selectedFile.filename}`}
								crossOrigin=""
								className="h-full"
							/>
							<MediaControlBar>
								<MediaPlayButton />
								<MediaMuteButton />
								<MediaVolumeRange />
								<MediaTimeRange />
								<MediaPipButton />
								<MediaFullscreenButton />
							</MediaControlBar>
						</MediaController>
					) : isFileAudio(selectedFile) ? (
						<MediaController className="w-full min-w-96 h-full">
							<audio slot="media" src={`${ENV.BASE_API_URL}/${selectedFile.filename}`} crossOrigin="" />
							<MediaControlBar>
								<MediaPlayButton />
								<MediaTimeDisplay showDuration />
								<MediaTimeRange />
								<MediaPlaybackRateButton />
								<MediaMuteButton />
								<MediaVolumeRange />
							</MediaControlBar>
						</MediaController>
					) : (
						<div className="h-full w-full">
							<FileTextViewer uuid={selectedFile.uuid} />
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	) : null;
}
