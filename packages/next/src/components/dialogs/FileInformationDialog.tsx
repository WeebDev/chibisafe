import { type PropsWithChildren } from 'react';
import type { FilePropsType, FileWithAdditionalData } from '@/types';
import type { DialogProps } from '@radix-ui/react-dialog';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileInformationDialogActions } from '@/components/FileInformationDialogActions';

export function FileInformationDialog({
	file,
	type,
	isOpen = false,
	onOpenChange = () => {}
}: PropsWithChildren<{
	readonly file: FileWithAdditionalData;
	readonly isOpen: DialogProps['open'];
	readonly onOpenChange: DialogProps['onOpenChange'];
	readonly type: FilePropsType;
}>) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent
				className={cn(
					// isVertical ? '!w-fit' : '!w-max',
					'max-w-[calc(100vw-8rem)] max-h-[calc(100vh-8rem)] min-h-[calc(100vh-8rem)] !w-max p-0'
				)}
			>
				<Tabs defaultValue="preview" className="relative">
					{/* <div className="grid grid-cols-[1fr,400px] gap-4"> */}
					{/* <div className="grid"> */}
					<TabsContent value="preview" className="mt-0">
						<div
							className={cn(
								isFileImage(file) || isFileVideo(file) ? 'h-[calc(100vh-11rem)]' : 'h-auto',
								'w-full'
							)}
						>
							{isFileImage(file) ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img src={file.url} className="h-full object-contain hidden md:block" />
							) : isFileVideo(file) ? (
								<MediaController className="h-full hidden md:block">
									<video slot="media" src={file.url} crossOrigin="" className="h-full" />
									<MediaControlBar>
										<MediaPlayButton />
										<MediaMuteButton />
										<MediaVolumeRange />
										<MediaTimeRange />
										<MediaPipButton />
										<MediaFullscreenButton />
									</MediaControlBar>
								</MediaController>
							) : isFileAudio(file) ? (
								<MediaController className="h-full hidden md:block">
									<audio slot="media" src={file.url} crossOrigin="" />
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
								<span className="text-light-100 h-full items-center hidden md:flex">
									Sorry but this file can't be previewed at this time.
								</span>
							)}
						</div>
					</TabsContent>
					<TabsContent value="information">some settings</TabsContent>
					<div className="flex justify-center">
						{/* <FileInformationDialogActions file={file} type={type} /> */}
						<TabsList className="mt-1">
							<TabsTrigger value="preview">Preview</TabsTrigger>
							<TabsTrigger value="info">Information</TabsTrigger>
						</TabsList>
					</div>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
