import { settingsAtom } from '@/lib/atoms/settings';
import type { UploaderOptions } from '@chibisafe/uploader-client';
import { chibiUploader } from '@chibisafe/uploader-client';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { debug } from '@/lib/utils';
import { uploadsAtom } from '@/lib/atoms/uploads';
import { toast } from 'sonner';

export const useUploadFile = ({ albumUuid }: { readonly albumUuid?: string | undefined }) => {
	const settings = useAtomValue(settingsAtom);
	const setUploads = useSetAtom(uploadsAtom);

	const uploadFile = useCallback(
		async ({
			file,
			endpoint,
			isNetworkStored,
			method = 'POST',
			identifier = '',
			publicUrl = ''
		}: {
			endpoint: string;
			file: File;
			identifier?: string;
			isNetworkStored: boolean;
			method: 'POST' | 'PUT';
			publicUrl?: string;
		}) => {
			const options: UploaderOptions = {
				debug: process.env.NODE_ENV !== 'production',
				endpoint,
				file,
				method,
				maxFileSize: settings?.maxSize ?? 9000 * 1024 * 1024,
				// If we're storing in s3, we don't want to chunk the file
				chunkSize: isNetworkStored
					? settings?.maxSize ?? 9000 * 1024 * 1024
					: settings?.chunkSize ?? 90 * 1024 * 1024,
				autoStart: true,
				maxParallelUploads: 1
			};

			if (isNetworkStored) {
				options.headers = {
					'Content-Type': file.type
				};

				if(endpoint.includes("digitaloceanspaces.com")){
					options.headers["x-amz-acl"] = "public-read";
				}
        
			} else {
				options.postParams = {
					name: file.name,
					type: file.type,
					size: file.size.toString()
				};

				options.headers = {
					credentials: 'include',
					albumuuid: albumUuid ?? ''
				};
			}

			await chibiUploader({
				...options,
				onStart: (uuid: string, totalChunks: number) => {
					debug(`Started uploading ${file.name} with uuid ${uuid} and ${totalChunks} chunks`);
					setUploads(draft => {
						draft.push({
							uuid,
							name: file.name,
							type: file.type,
							processing: true,
							status: 'uploading',
							bytesSent: 0,
							bytesTotal: file.size,
							progress: 0,
							url: '',
							albumUuid: albumUuid ?? null
						});
					});
				},
				onError: (uuid: string, error: any) => {
					debug(`Error uploading ${file.name} with uuid ${uuid}`, error.message);
					setUploads(draft => {
						const upload = draft.findIndex(file => file.uuid === uuid);
						if (upload !== -1) {
							draft[upload]!.status = 'error';
							draft[upload]!.error = error.message;
							draft[upload]!.processing = false;
						}
					});
				},
				onProgress: (uuid: string, progress: any) => {
					debug(`Progress uploading ${file.name} with uuid ${uuid}`, progress);
					setUploads(draft => {
						const upload = draft.findIndex(u => u.uuid === uuid);
						if (upload !== -1) {
							draft[upload]!.progress = progress;
						}
					});
				},
				onRetry: (_, reason: any) => {
					console.log('onRetry', reason);
				},
				onFinish: async (uuid: string, response: any) => {
					if (isNetworkStored) {
						debug('Finished uploading file to S3 storage', {
							name: file.name,
							uuid,
							url: publicUrl
						});

						setUploads(draft => {
							const upload = draft.findIndex(file => file.uuid === uuid);
							if (upload !== -1) {
								draft[upload]!.status = 'success';
								draft[upload]!.url = publicUrl;
								draft[upload]!.processing = false;
							}
						});

						return fetch('/api/upload/process', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								credentials: 'include',
								albumuuid: albumUuid ?? ''
							},
							body: JSON.stringify({ identifier, name: file.name, type: file.type })
						})
							.then(async res => {
								if (!res.ok) {
									const error = await res.json();
									throw new Error(error.message);
								}

								return res.json();
							})
							.then(res => {
								setUploads(draft => {
									const upload = draft.findIndex(file => file.uuid === uuid);
									if (upload !== -1) {
										draft[upload]!.status = 'success';
										draft[upload]!.url = res.url;
										draft[upload]!.processing = false;
									}
								});

								debug('Finished processing file', {
									name: file.name,
									uuid,
									url: res.url
								});
							})
							.catch(error => {
								setUploads(draft => {
									const upload = draft.findIndex(file => file.uuid === uuid);
									if (upload !== -1) {
										draft[upload]!.status = 'error';
										draft[upload]!.error = error.message;
										draft[upload]!.processing = false;
									}
								});
								toast.error(error.message);
							});
					}

					debug('Finished uploading file', {
						name: file.name,
						uuid,
						url: response.url
					});

					setUploads(draft => {
						const upload = draft.findIndex(file => file.uuid === uuid);
						if (upload !== -1) {
							draft[upload]!.status = 'success';
							draft[upload]!.url = response.url;
							draft[upload]!.processing = false;
						}
					});
					return null;
				}
			});
		},
		[albumUuid, setUploads, settings?.chunkSize, settings?.maxSize]
	);

	return { uploadFile };
};
