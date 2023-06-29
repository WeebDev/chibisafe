/* eslint-disable require-atomic-updates */

import type { Settings } from '@/structures/interfaces';
import randomstring from 'randomstring';
import prisma from './database';
import process from 'node:process';
import { log } from '@/main';

export const SETTINGS = {} as Settings;
export const getSettingsMeta = (key: string) => {
	if (key in SETTINGS_META) {
		// @ts-ignore
		return SETTINGS_META[key];
	}
};

export const loadSettings = async (force = false) => {
	log.debug('Loading settings...');
	// if SETTINGS is not empty, return it
	if (Object.keys(SETTINGS).length > 0 && !force) return SETTINGS;

	// if SETTINGS is empty, get it from the database
	const settingsTable = await prisma.settings.findFirst();
	if (settingsTable) {
		log.debug('Settings already exist in database, skipping creation...');

		// These settings should be set from the environment variables
		SETTINGS.port = Number.isNaN(Number(process.env.PORT)) ? 8000 : Number(process.env.PORT) ?? 8000;
		SETTINGS.host = process.env.HOST ?? '0.0.0.0';

		// These are static for now
		SETTINGS.statisticsCron = '0 0 * * * *';
		SETTINGS.enabledStatistics = ['system', 'service', 'fileSystems', 'uploads', 'users', 'albums'];

		// These settings should be set from the database
		SETTINGS.serviceName = settingsTable.serviceName;
		SETTINGS.serveUploadsFrom = settingsTable.serveUploadsFrom;
		SETTINGS.rateLimitWindow = settingsTable.rateLimitWindow;
		SETTINGS.rateLimitMax = settingsTable.rateLimitMax;
		SETTINGS.secret = settingsTable.secret;
		SETTINGS.chunkSize = Number(settingsTable.chunkSize);
		SETTINGS.chunkedUploadsTimeout = settingsTable.chunkedUploadsTimeout;
		SETTINGS.maxSize = Number(settingsTable.maxSize);
		SETTINGS.generateZips = settingsTable.generateZips;
		SETTINGS.enableMixedCaseFilenames = settingsTable.enableMixedCaseFilenames;
		SETTINGS.generatedFilenameLength = settingsTable.generatedFilenameLength;
		SETTINGS.generatedAlbumLength = settingsTable.generatedAlbumLength;
		SETTINGS.blockedExtensions = JSON.parse(settingsTable.blockedExtensions);
		SETTINGS.blockNoExtension = settingsTable.blockNoExtension;
		SETTINGS.publicMode = settingsTable.publicMode;
		SETTINGS.userAccounts = settingsTable.userAccounts;
		SETTINGS.disableStatisticsCron = settingsTable.disableStatisticsCron;
		SETTINGS.backgroundImageURL = settingsTable.backgroundImageURL;
		SETTINGS.logoURL = settingsTable.logoURL;
		SETTINGS.metaDescription = settingsTable.metaDescription;
		SETTINGS.metaKeywords = settingsTable.metaKeywords;
		SETTINGS.metaTwitterHandle = settingsTable.metaTwitterHandle;
		SETTINGS.metaDomain = settingsTable.metaDomain;
		SETTINGS.usersStorageQuota = Number(settingsTable.usersStorageQuota);
		return;
	}

	// if SETTINGS is empty and there is no database entry, create it
	log.debug("Settings don't exist in database, creating...");
	const data = {
		rateLimitWindow: 1000,
		rateLimitMax: 100,
		secret: randomstring.generate(64),
		serviceName: 'change-me',
		serveUploadsFrom: '',
		chunkSize: 9 * 9e6, // 90 MB
		chunkedUploadsTimeout: 30 * 60 * 1000, // 30 minutes
		maxSize: 1 * 1e9, // 1 GB
		generateZips: true,
		enableMixedCaseFilenames: true,
		generatedFilenameLength: 12,
		generatedAlbumLength: 6,
		blockedExtensions: JSON.stringify(['.jar', '.exe', '.msi', '.com', '.bat', '.cmd', '.scr', '.ps1', '.sh']),
		blockNoExtension: true,
		publicMode: false,
		userAccounts: false,
		disableStatisticsCron: false,
		backgroundImageURL: '',
		logoURL: '',
		metaDomain: 'https://your-domain.com',
		metaDescription: 'description for please-change-me.com 🚀',
		metaKeywords: 'comma, separated, keywords, that, describe, this, website',
		metaTwitterHandle: '@your-twitter-handle',
		usersStorageQuota: 0
	};

	await prisma.settings.create({
		data: {
			...data,
			// This is due to prisma not supporting int64
			maxSize: String(data.maxSize),
			chunkSize: String(data.chunkSize),
			usersStorageQuota: String(data.usersStorageQuota)
		}
	});

	log.debug('Settings created, loading...');

	await loadSettings();
};

const SETTINGS_META = {
	port: {
		type: 'number',
		description: 'The port the server will listen on.',
		name: 'Port'
	},
	host: {
		type: 'string',
		description: 'The host the server will listen on.',
		name: 'Host'
	},
	serveUploadsFrom: {
		type: 'string',
		description:
			'Fill this if you want to serve your files from a custom domain with nginx/caddy. Leave empty to let chibisafe handle it.',
		name: 'Serve Uploads From',
		example: 'https://cdn.chibisafe.moe',
		notice: 'For this setting to take effect, you need to restart the server.'
	},
	rateLimitWindow: {
		type: 'number',
		description: 'The window in milliseconds for rate limiting.',
		name: 'Rate Limit Window',
		notice: 'For this setting to take effect, you need to restart the server.',
		example: '1000'
	},
	rateLimitMax: {
		type: 'number',
		description: 'The maximum amount of requests per window for rate limiting.',
		name: 'Rate Limit Max',
		notice: 'For this setting to take effect, you need to restart the server.',
		example: '100'
	},
	secret: {
		type: 'string',
		description: 'A secret string used for signing JWT tokens. Keep this secret!',
		name: 'Secret',
		notice: 'If you change this setting every user will be asked to log back in. Make sure this setting is random and at least 64 characters long.'
	},
	serviceName: {
		type: 'string',
		description: 'The name of the service.',
		name: 'Service Name',
		example: 'Chibisafe'
	},
	chunkSize: {
		type: 'number',
		description:
			'The size of each chunk in bytes. This setting is useful if you want to upload big files, splitting them into smaller chunks.',
		name: 'Chunk Size',
		example: '9000000'
	},
	chunkedUploadsTimeout: {
		type: 'number',
		description: 'The timeout in milliseconds for chunked uploads.',
		name: 'Chunked Uploads Timeout'
	},
	maxSize: {
		type: 'number',
		description: 'The maximum size of an upload in bytes.',
		name: 'Max Size',
		example: '1000000000'
	},
	generateZips: {
		type: 'boolean',
		description: 'Whether or not to allow users to generate zips from public albums.',
		name: 'Generate Zips'
	},
	enableMixedCaseFilenames: {
		type: 'boolean',
		description: 'Whether to allow mixed case filenames.',
		name: 'Enable Mixed Case Filenames'
	},
	generatedFilenameLength: {
		type: 'number',
		description: 'The length of the generated filenames.',
		name: 'Generated Filename Length',
		notice: 'This setting should at least be 8 characters long to avoid collisions.'
	},
	generatedAlbumLength: {
		type: 'number',
		description: 'The length of the generated album names.',
		name: 'Generated Album Length',
		notice: 'This setting should at least be 4 characters long to avoid collisions.'
	},
	blockedExtensions: {
		type: 'object',
		description:
			'The blocked extensions for uploads. When adding a new one, make sure you don\'t include the "." dot.',
		name: 'Blocked Extensions'
	},
	blockNoExtension: {
		type: 'boolean',
		description: 'Whether or not to block uploads without an extension.',
		name: 'Block No Extension'
	},
	publicMode: {
		type: 'boolean',
		description:
			'Whether or not to enable public mode. If enabled, users will be able to upload files without an account.',
		name: 'Public Mode'
	},
	userAccounts: {
		type: 'boolean',
		description:
			'Whether or not to enable user accounts. If disabled, users will not be able to register new accounts.',
		name: 'User Accounts'
	},
	disableStatisticsCron: {
		type: 'boolean',
		description: 'Whether or not to disable the statistics cron.',
		name: 'Disable Statistics Cron'
	},
	backgroundImageURL: {
		type: 'string',
		description: 'The URL for the background image of the instance.',
		name: 'Background Image URL'
	},
	logoURL: {
		type: 'string',
		description: 'The URL for the logo.',
		name: 'Logo URL'
	},
	metaDomain: {
		type: 'string',
		description: 'The meta domain used for the website SEO.',
		name: 'Meta Domain',
		example: 'https://chibisafe.moe'
	},
	metaDescription: {
		type: 'string',
		description: 'The meta description for the website SEO.',
		name: 'Meta Description',
		example: 'A simple and easy to use file hosting service.'
	},
	metaKeywords: {
		type: 'string',
		description: 'The meta keywords for the website SEO.',
		name: 'Meta Keywords',
		example: 'file, hosting, service'
	},
	metaTwitterHandle: {
		type: 'string',
		description: 'The twitter handle of the instance owner.',
		name: 'Meta Twitter Handle',
		example: '@chibisafe'
	},
	usersStorageQuota: {
		type: 'number',
		description: 'The storage quota for each user in bytes. 0 for unlimited.',
		name: 'Users Storage Quota',
		notice: "You can override this setting by changing it on a user's profile."
	}
};
