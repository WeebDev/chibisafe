import type { FileWithFileMetadataAndIndex } from './atoms/fileDialog';

export const formatBytes = (bytes: number, decimals = 2) => {
	if (bytes === 0) return '0 Bytes';

	// If the size is MB add a decimal point
	if (bytes >= 1000000) {
		// eslint-disable-next-line no-param-reassign
		decimals = 1;
	}

	const k = 1000;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

export const isFileVideo = (file: FileWithFileMetadataAndIndex | null) => {
	if (!file?.fileMetadata) return false;
	const { mimeType } = file.fileMetadata;
	return mimeType?.startsWith('video/');
};

export const isFileImage = (file: FileWithFileMetadataAndIndex | null) => {
	if (!file?.fileMetadata) return false;
	const { mimeType } = file.fileMetadata;
	return mimeType?.startsWith('image/');
};

export const isFileAudio = (file: FileWithFileMetadataAndIndex | null) => {
	if (!file?.fileMetadata) return false;
	const { mimeType } = file.fileMetadata;
	return mimeType?.startsWith('audio/');
};

export const isFilePDF = (file: FileWithFileMetadataAndIndex | null) => {
	if (!file?.fileMetadata) return false;
	const { mimeType } = file.fileMetadata;
	return mimeType === 'application/pdf';
};

export const getFileExtension = (name: string) => {
	return name.split('.').pop();
};

export function convertDataRateLog(inputBytesPerSecond: number): string {
	const units = ['B/s', 'kB/s', 'MB/s', 'GB/s', 'TB/s'];
	const base = 1_000;

	if (inputBytesPerSecond < 1) {
		return inputBytesPerSecond + ' ' + units[0];
	}

	const exponent = Math.floor(Math.log10(inputBytesPerSecond) / Math.log10(base));
	const value = inputBytesPerSecond / base ** exponent;

	return value.toFixed(2) + ' ' + units[exponent];
}

export function convertDataRateLogBinary(inputBytesPerSecond: number): string {
	const units = ['B/s', 'KiB/s', 'MiB/s', 'GiB/s', 'TiB/s'];
	const base = 1_024;

	if (inputBytesPerSecond < 1) {
		return inputBytesPerSecond + ' ' + units[0];
	}

	const exponent = Math.floor(Math.log2(inputBytesPerSecond) / Math.log2(base));
	const value = inputBytesPerSecond / base ** exponent;

	return value.toFixed(2) + ' ' + units[exponent];
}
