import process from 'node:process';
import { lookpath } from 'lookpath';
import log from './Log';

export default async () => {
	const nodeMajorVersion = process.versions.node.split('.')[0];
	if (Number(nodeMajorVersion) < 18) {
		log.error('chibisafe needs node v18 or newer to run properly, please upgrade.');
		process.exit(1);
	}

	if (!process.env.JWT_SECRET) {
		log.error('It seems there are no environment variables configured. To fix this please run `npm run setup`');
		process.exit(1);
	}

	const ffmpegExists = await lookpath('ffmpeg');
	if (!ffmpegExists) {
		log.error(
			"chibisafe couldn't find ffmpeg in your path. ffmpeg is needed to process thumbnails for uploads, please install it."
		);
		process.exit(1);
	}
};
