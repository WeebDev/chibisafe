import type { FileDropItem } from 'react-aria';
import { ulid } from 'ulid';

export async function chunkFile(item: File | FileDropItem, chunkSize: number) {
	const chunks: Blob[] = [];
	const file = item instanceof File ? item : await item.getFile();
	const chunkTotal = Math.ceil(file.size / chunkSize);

	for (let idx = 0; idx < chunkTotal; idx++) {
		const start = idx * chunkSize;
		const end = Math.min(start + chunkSize, file.size);
		chunks.push(file.slice(start, end));
	}

	return chunks;
}

export async function uploadChunks({
	chunks,
	filename,
	folderUuid,
	onStart,
	onError,
	onProgress,
	onFinish
}: {
	readonly chunks: Blob[];
	readonly filename: string;
	readonly folderUuid?: string;
	onError?(uuid: string, message: string, idx: number, totalChunks: number, lastChunk: boolean): void;
	onFinish?(uuid: string, filename: string | null, idx: number, totalChunks: number, lastChunk: boolean): void;
	onProgress?(
		uuid: string,
		idx: number,
		totalChunks: number,
		lastChunk: boolean,
		percentComplete: number,
		uploadSpeed: number
	): void;
	onStart?(uuid: string, idx: number, totalChunks: number, lastChunk: boolean): void;
}) {
	const maxParallelChunks = 10; // Set the maximum number of parallel chunks
	const uploadPromises: Promise<void>[] = [];
	let activeUploads = 0;
	let totalBytesUploaded = 0;

	const uuid = ulid();
	const headers = {
		'chibi-chunks-total': chunks.length.toString(),
		'chibi-chunks-uuid': uuid,
		'chibi-folder-uuid': folderUuid
	};

	const uploadChunk = async (chunk: Blob, idx: number, lastChunk = false) => {
		if (activeUploads >= maxParallelChunks) {
			await Promise.race(uploadPromises);
		}

		const chunkHeaders = { ...headers, 'chibi-chunk-index': idx.toString() };

		const uploadPromise = new Promise<void>((resolve, reject) => {
			const startTime = performance.now();
			onStart?.(uuid, idx, chunks.length, lastChunk);
			const formData = new FormData();
			formData.append('file', chunk);
			formData.append('name', filename);

			const xhr = new XMLHttpRequest();
			xhr.open('POST', '/api/v1/upload', true);
			xhr.withCredentials = true;

			xhr.upload.addEventListener('progress', event => {
				if (event.lengthComputable) {
					const percentComplete = (event.loaded / event.total) * 100;
					const currentTime = performance.now();
					const elapsedTime = (currentTime - startTime) / 1_000; // Convert to seconds
					const uploadSpeed = event.loaded / elapsedTime; // Calculate upload speed in bytes per second
					onProgress?.(uuid, idx, chunks.length, lastChunk, percentComplete, uploadSpeed);
					console.log('Upload progress:', percentComplete);
					console.log('Upload speed:', uploadSpeed.toFixed(2), 'bytes/s');
				}
			});

			xhr.onreadystatechange = event => {
				if (xhr.readyState === XMLHttpRequest.DONE) {
					if (xhr.status >= 200 && xhr.status < 300) {
						console.log('Chunk uploaded successfully:', chunk);
						totalBytesUploaded += chunk.size;
						if (lastChunk) {
							const response = JSON.parse(xhr.response);
							onFinish?.(uuid, response.filename, idx, chunks.length, lastChunk);
						} else {
							onFinish?.(uuid, null, idx, chunks.length, lastChunk);
						}

						resolve();
					} else {
						const message = JSON.parse(xhr.response).message;
						onError?.(uuid, message, idx, chunks.length, lastChunk);
						console.error('Error uploading chunk:', chunk);
						reject(event);
					}

					activeUploads--;
				}
			};

			for (const [key, value] of Object.entries(chunkHeaders)) {
				if (value) {
					xhr.setRequestHeader(key, value);
				}
			}

			xhr.send(formData);
			activeUploads++;
		});

		if (lastChunk) {
			await uploadPromise;
		} else {
			uploadPromises.push(uploadPromise);
		}
	};

	const lastChunk = chunks.at(-1);
	for (const [idx, chunk] of chunks.slice(0, chunks.length - 1).entries()) {
		await uploadChunk(chunk, idx);
	}

	try {
		await Promise.all(uploadPromises);
		if (lastChunk) {
			await uploadChunk(lastChunk, chunks.length - 1, true);
		}

		console.log('All chunks uploaded successfully');
		console.log('Total bytes uploaded:', totalBytesUploaded);
	} catch (error) {
		console.error('Error uploading chunks:', error);
	}
}
