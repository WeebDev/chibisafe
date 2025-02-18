'use client';

import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { saveSettings } from '@/actions/SaveSettingsAction';
import { FormFieldNumber } from './fields/FormFieldNumber';
import { FormFieldBoolean } from './fields/FormFieldBoolean';
import { FormFieldString } from './fields/FormFieldString';
import type { components } from '@/util/openapiSchema';
import { openAPIClient } from '@/lib/clientFetch';

export type Setting = {
	description: string;
	example: string | null;
	key: string;
	name: string;
	notice: string | null;
};

const SiteSettingsSchema = z.object({
	siteName: z.string().trim().min(1, { message: 'Required' }),
	siteUrl: z.string().refine(
		value => {
			try {
				new URL(value);
				return true;
			} catch {
				return false;
			}
		},
		{
			message: 'Please enter a valid URL'
		}
	),
	siteUploadsUrl: z
		.string()
		.optional()
		.refine(
			value => {
				if (!value) return true;
				try {
					new URL(value);
					return true;
				} catch {
					return false;
				}
			},
			{
				message: 'Please enter a valid URL'
			}
		),
	siteDescription: z.string().optional(),
	siteKeywords: z.any().optional(),
	siteAuthor: z.string().optional(),
	siteTheme: z.string().optional(),
	siteLogoUrl: z.string().optional(),
	siteBackgroundUrl: z.string().optional(),
	siteMinimalisticUi: z.boolean(),
	registrationEnabled: z.boolean(),
	anonymousUploadsEnabled: z.boolean(),
	thumbnailGenerationEnabled: z.boolean(),
	secret: z.string().min(1, { message: 'Required' }),
	uploadChunkSize: z.coerce.number(),
	uploadMaxSize: z.coerce.number(),
	uploadDisallowedFileExtensions: z.array(z.string()),
	uploadDisallowNoFileExtension: z.boolean(),
	zippingEnabled: z.boolean(),
	fileIdentifierLength: z.coerce.number().min(4, { message: 'Required' }),
	folderIdentifierLength: z.coerce.number().min(4, { message: 'Required' }),
	snippetIdentifierLength: z.coerce.number().min(4, { message: 'Required' }),
	urlShorteningIdentifierLength: z.coerce.number().min(4, { message: 'Required' })
});

const settingsMetadata = {
	siteName: {
		description: 'The name of the site.',
		name: 'Site Name',
		example: 'Chibisafe'
	},
	siteUrl: {
		description: 'Make sure to change this setting to reflect the full domain name you are hosting chibisafe on.',
		name: 'Site URL',
		example: 'https://chibisafe.app',
		notice: 'Make sure to use a full domain name, including https:// . (for example: https://cdn.chibisafe.app)'
	},
	siteUploadsUrl: {
		description: 'TBA',
		name: 'Site Uploads Url'
	},
	secret: {
		description: 'A secret string used for signing JWT tokens. Keep this secret!',
		name: 'Secret',
		notice: 'Changing this will log out everyone. Make sure this setting is random and at least 64 characters long.'
	},
	uploadChunkSize: {
		description:
			'The size of each chunk in bytes. This setting is useful if you want to upload big files, splitting them into smaller chunks.',
		name: 'Upload Chunk Size',
		example: '9000000'
	},
	uploadMaxSize: {
		description: 'The maximum size of an upload in bytes.',
		name: 'Upload Max Size',
		example: '1000000000'
	},
	zippingEnabled: {
		description: 'Whether or not to allow users to generate zips from public albums.',
		name: 'Generate Zips'
	},
	generateOriginalFileNameWithIdentifier: {
		description: 'Whether to generate filenames with the original filename and identifer as a suffix.',
		name: 'Enable Original Filename with Identifier'
	},
	fileIdentifierLength: {
		description: 'The length of the generated filenames.',
		name: 'Filename Identifier Length',
		notice: 'This setting should at least be 8 characters long to avoid collisions.'
	},
	folderIdentifierLength: {
		description: 'The length of the generated album names.',
		name: 'Album Identifier Length',
		notice: 'This setting should at least be 4 characters long to avoid collisions.'
	},
	snippetIdentifierLength: {
		description: 'The length of the generated snippet link.',
		name: 'Snippet Identifier Length',
		notice: 'This setting should at least be 4 characters long to avoid collisions.'
	},
	urlShorteningIdentifierLength: {
		description: 'The length of the generated short URL links.',
		name: 'Generated short URL Length',
		notice: 'This setting should at least be 8 characters long to avoid collisions.'
	},
	uploadDisallowedFileExtensions: {
		description: 'The blocked extensions for uploads. Separate them with a comma.',
		name: 'Blocked Extensions',
		example: '.exe,.msi,.com,.bat,.cmd,.scr,.ps1,.sh'
	},
	uploadDisallowNoFileExtension: {
		description: 'Whether or not to block uploads without an extension.',
		name: 'Block no Extension'
	},
	anonymousUploadsEnabled: {
		description: 'If anonymous uploads are enabled, users will be able to upload files without being logged in.',
		name: 'Anonymous Uploads'
	},
	registrationEnabled: {
		description:
			'If registration is disabled, users will not be able to register new accounts unless they have an invite.',
		name: 'Registration Enabled'
	},
	// disableStatisticsCron: {
	// 	description: 'Whether or not to disable the statistics cron.',
	// 	name: 'Disable Statistics Cron'
	// },
	// disableUpdateCheck: {
	// 	description: 'Whether or not to disable the update check.',
	// 	name: 'Disable Update Check'
	// },
	siteBackgroundUrl: {
		description: 'The URL for the background image of the instance.',
		name: 'Background Image URL'
	},
	siteLogoUrl: {
		description: 'The URL for the logo.',
		name: 'Logo URL'
	},
	siteDescription: {
		description: 'The meta description for the website SEO.',
		name: 'Site Description',
		example: 'A simple and easy to use file hosting service.'
	},
	siteKeywords: {
		description: 'The meta keywords for the website SEO.',
		name: 'Site Keywords',
		example: 'file, hosting, service'
	},
	siteAuthor: {
		description: 'The twitter handle of the instance owner.',
		name: 'Site Author',
		example: '@your-instance-handle'
	},
	siteTheme: {
		description: 'The theme for the website.',
		name: 'Theme'
	},
	// usersStorageQuota: {
	// 	description: 'The storage quota for each user in bytes. 0 for unlimited.',
	// 	name: 'Users Storage Quota',
	// 	notice: "You can override this setting by changing it on a user's profile."
	// },
	// useUrlShortener: {
	// 	description: 'Whether or not to use the built-in URL shortener.',
	// 	name: 'Use URL Shortener'
	// },
	useNetworkStorage: {
		description: 'Whether or not to use network storage like S3/Backblaze/Wasabi.',
		name: 'Use Network Storage'
	},
	thumbnailGenerationEnabled: {
		description: 'Whether or not to generate thumbnails for images and videos.',
		name: 'Generate Thumbnails'
	},
	// S3Region: {
	// 	description: 'The region for the S3 bucket.',
	// 	name: 'S3 Region'
	// },
	// S3Bucket: {
	// 	description: 'The name of the S3 bucket.',
	// 	name: 'S3 Bucket'
	// },
	// S3AccessKey: {
	// 	description: 'The accesss key for the S3 bucket.',
	// 	name: 'S3 Access Key'
	// },
	// S3SecretKey: {
	// 	description: 'The secret key for the S3 bucket.',
	// 	name: 'S3 Secret Key'
	// },
	// S3Endpoint: {
	// 	description: 'The endpoint for the S3 bucket. Leave empty for AWS S3.',
	// 	name: 'S3 Endpoint'
	// },
	// S3PublicUrl: {
	// 	description: 'The public URL for the S3 bucket. Needed for AWS S3, not sure for others.',
	// 	name: 'S3 Public URL',
	// 	example: 'https://chibisafe.s3.us-east-1.amazonaws.com'
	// },
	siteMinimalisticUi: {
		description: 'Whether or not to use a minimal version of the homepage.',
		name: 'Use Minimalistic UI'
	}
	// privacyPolicyPageContent: {
	// 	description: 'The markdown content for the privacy policy page. Leave empty to disable.',
	// 	name: 'Privacy Policy Page'
	// },
	// termsOfServicePageContent: {
	// 	description: 'The markdown content for the terms of service page. Leave empty to disable.',
	// 	name: 'Terms of Service Page'
	// },
	// rulesPageContent: {
	// 	description: 'The markdown content for the rules page. Leave empty to disable.',
	// 	name: 'Rules Page'
	// }
};

type FormValues = z.infer<typeof SiteSettingsSchema>;

export const SettingsForm = ({ settings }: { readonly settings: components['schemas']['Settings'] }) => {
	const queryClient = useQueryClient();

	const flatValues = Object.entries(settings).map(([key, value]) => {
		return {
			[key]: value.value
		};
	});

	const settingsWithMetadata = Object.entries(settings).map(([key, value]) => {
		// @ts-expect-error types
		const setting = settingsMetadata[key] as Setting;
		return {
			...setting,
			key,
			value: value.value,
			type: value.type
		};
	});

	const form = useForm<FormValues>({
		resolver: zodResolver(SiteSettingsSchema),
		defaultValues: flatValues.reduce((acc, curr) => {
			return { ...acc, ...curr };
		}, {}),
		mode: 'onChange'
	});

	const onSubmit = async (data: FormValues) => {
		const parsedSettingsObject = Object.entries(data).map(([key, value]) => {
			if (key === 'siteKeywords') {
				return {
					[key]: {
						value: String(value).split(',')
					}
				};
			}

			return {
				[key]: {
					value
				}
			};
		});

		const parsedSettings = parsedSettingsObject.reduce((acc, curr) => {
			return { ...acc, ...curr };
		}, {});

		try {
			const { error } = await openAPIClient.PATCH('/api/v1/settings', {
				body: parsedSettings
			});

			if (error) {
				toast.error(error.message);
				return;
			}

			toast.success('Settings saved. Please note that some settings may require a server restart to take effect');
			saveSettings();
			void queryClient.invalidateQueries({ queryKey: ['settings'] });
		} catch (error: any) {
			console.error(error);
		}
	};

	return (
		<div>
			{form.formState.errors ? (
				<div className="p-2 mb-4">
					<ul className="list-disc px-6 bg-red-800 rounded-sm">
						{Object.keys(form.formState.errors)
							.map(key => {
								// @ts-expect-error types
								return form.formState.errors[key].message ? (
									<li key={key} className="">
										Error in the field <span className="underline underline-offset-2">{key}</span>:{' '}
										{
											// @ts-expect-error types
											form.formState.errors[key].message
										}
									</li>
								) : null;
							})
							.filter(item => item !== null)}
					</ul>
				</div>
			) : null}

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
					{settingsWithMetadata.map(setting => {
						const type = setting.type;

						switch (type) {
							case 'string':
							case 'array':
								return (
									<FormFieldString
										key={setting.key}
										form={form}
										data={{
											key: setting.key,
											name: setting.name,
											description: setting.description,
											example: setting.example,
											notice: setting.notice
										}}
									/>
								);
							case 'number':
								return (
									<FormFieldNumber
										key={setting.key}
										form={form}
										data={{
											key: setting.key,
											name: setting.name,
											description: setting.description,
											example: setting.example,
											notice: setting.notice
										}}
									/>
								);
							case 'boolean':
								return (
									<FormFieldBoolean
										key={setting.key}
										form={form}
										data={{
											key: setting.key,
											name: setting.name,
											description: setting.description,
											example: setting.example,
											notice: setting.notice
										}}
									/>
								);
							default:
								return <div key={setting.key}>No component found for type: {setting.type}</div>;
						}
					})}

					<Button type="submit" className="mt-4 max-w-36">
						Save settings
					</Button>
				</form>
			</Form>
		</div>
	);
};
