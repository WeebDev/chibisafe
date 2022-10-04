import HyperExpress from 'hyper-express';
// @ts-ignore
import LiveDirectory from 'live-directory';
import jetpack from 'fs-jetpack';
import log from './utils/Log';
import process from 'node:process';
import path from 'node:path';
// import helmet from 'helmet';
import cors from 'cors';
import Routes from './structures/routes';
import { getEnvironmentDefaults } from './utils/Util';

// Stray errors and exceptions capturers
process.on('uncaughtException', error => {
	log.error('Uncaught Exception:');
	log.error(error);
});

process.on('unhandledRejection', error => {
	log.error('Unhandled Rejection:');
	log.error(error);
});

const start = async () => {
	const server = new HyperExpress.Server({
		// TODO: Configurable? Should not trust proxy if directly running on an exposed port,
		// instead of behind a reverse proxy like Nginx, and/or CDNs like Cloudflare
		trust_proxy: true,
		fast_buffers: true
	});

	// TODO: Figure this out
	// server.use(helmet());
	server.use(
		cors({
			allowedHeaders: [
				'Accept',
				'Authorization',
				'Cache-Control',
				'X-Requested-With',
				'Content-Type',
				'albumId',
				'finishedChunks',
				'application/vnd.chibisafe.json' // I'm deprecating this header but will remain here for compatibility reasons
			]
		})
	);

	// Create the neccessary folders
	jetpack.dir('../uploads/zips');
	jetpack.dir('../uploads/chunks', { empty: true });
	jetpack.dir('../uploads/thumbs/square');
	jetpack.dir('../uploads/thumbs/preview');

	log.info('Chibisafe is starting with the following configuration:');
	log.info('');

	const defaults = getEnvironmentDefaults();
	for (const [key, value] of Object.entries(defaults)) {
		log.info(`${key}: ${JSON.stringify(value)}`);
	}

	log.info('');

	log.info('Loading routes...');
	log.info('');
	// Scan and load routes into express
	await Routes.load(server);

	if (process.env.NODE_ENV === 'production') {
		if (!jetpack.exists(path.join(__dirname, '..', '..', 'frontend', 'dist', 'index.html'))) {
			log.error('Frontend build not found, please run `npm run build` in the frontend directory');
			process.exit(1);
		}

		const LiveAssets = new LiveDirectory({
			path: path.join(__dirname, '..', '..', 'frontend', 'dist')
		});

		server.get('/', (req, res) => {
			const file = LiveAssets.get('index.html');
			return res.type(file.extension).send(file.buffer);
		});

		server.get('/*', (req, res) => {
			const file = LiveAssets.get(req.path);
			if (!file) return res.status(404).send('Not found');
			return res.type(file.extension).send(file.buffer);
		});
	}

	// Start the server
	await server.listen(8000);
	log.info('');
	log.info('Server ready on port 8000');
};

void start();
