import jetpack from 'fs-jetpack';
import path from 'node:path';
import { inspect } from 'node:util';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import type { FastifyInstance, FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import type { RouteOptions } from './interfaces';
import { addSpaces } from '@/utils/Util';
import { SETTINGS } from './settings';

const defaultMiddlewares = ['ban'];

export default {
	load: async (server: FastifyInstance) => {
		// Add global rate limit
		await server.register(import('@fastify/rate-limit'), {
			global: true,
			max: SETTINGS.rateLimitMax,
			timeWindow: SETTINGS.rateLimitWindow
		});

		// Different extension for build and dev modes
		const extension = `${process.env.NODE_ENV === 'production' ? 'j' : 't'}s`;

		// Load the base schemas to extend from
		const baseSchemaFiles = await jetpack.findAsync(path.join(__dirname, '..', 'structures', 'schemas'), {
			matching: `*.${extension}`
		});

		for (const schemaFile of baseSchemaFiles) {
			// Replace extension from ts to js if in production
			const replace = process.env.NODE_ENV === 'production' ? `dist/` : `src/`;
			const fileUrl = pathToFileURL(schemaFile.replace(replace, `../`));
			const schema = await import(fileUrl.toString());
			server.addSchema(schema.default);
		}

		/*
			While in development we only want to match routes written in TypeScript but for production
			we need to change it to javascript files since they will be compiled.
		*/

		const allRouteFiles = await jetpack.findAsync(path.join(__dirname, '..', 'routes'), {
			matching: `*.${extension}`
		});

		const routeFiles = allRouteFiles.filter(file => !file.endsWith(`.schema.${extension}`));
		const schemaFiles = allRouteFiles.filter(file => file.endsWith(`.schema.${extension}`));

		for (const routeFile of routeFiles) {
			try {
				// Replace extension from ts to js if in production
				const replace = process.env.NODE_ENV === 'production' ? `dist/` : `src/`;
				const route = await import(routeFile.replace(replace, `../`));
				const options: RouteOptions = route.options;

				// Try to grab the schema file for the route
				const routeFileName = routeFile.split('/').pop();
				const schemaFile = schemaFiles.find(file => {
					if (!routeFileName) return null;
					return routeFile.replace(routeFileName, routeFileName?.replace('.', '.schema.')) === file;
				});

				let schema: any;
				if (schemaFile) {
					const fileUrl = pathToFileURL(schemaFile.replace(replace, `../`));
					schema = (await import(fileUrl.toString())).default;
				}

				// const schema = await import(fileUrl as unknown as string);
				// schema = schemaFile ? (await import(schemaFile.replace(replace, `../`))).default : undefined;

				if (!options.url || !options.method) {
					server.log.warn(`Found route without URL or METHOD - ${routeFile}`);
					continue;
				}

				options.url = `${route.options?.ignoreRoutePrefix ? '' : '/api'}${options.url}`;

				// Init empty route's options object, if applicable
				if (!options.options) {
					options.options = {};
				}

				// Run middlewares if any, and in order of execution
				const middlewares: any[] = [];

				// Set default middlewares that need to be included
				for (const middleware of defaultMiddlewares) {
					const fileUrl = pathToFileURL(path.join(__dirname, '..', 'middlewares', middleware));
					const importedMiddleware = await import(fileUrl.toString());
					middlewares.push(importedMiddleware.default);
				}

				// Now load the middlewares defined in the route file
				if (options.middlewares?.length) {
					for (const middleware of options.middlewares) {
						let name: string | unknown | undefined;
						let middlewareOptions: { [index: number | string]: any } | undefined;

						if (typeof middleware === 'string') {
							name = middleware;
						} else if (typeof middleware === 'object') {
							name = middleware.name;
							// Create a shallow copy of the middleware object, containing all properties but "name"
							middlewareOptions = { ...middleware };
							delete middlewareOptions.name;
						}

						// Assert that middleware name is a valid string
						if (!name || typeof name !== 'string') {
							server.log.error(`Invalid middleware options in route ${options.method} ${options.url}`);
							continue;
						}

						const fileUrl = pathToFileURL(path.join(__dirname, '..', 'middlewares', name));
						const importedMiddleware = await import(fileUrl.toString());

						// Init anonymous function, to pass middleware options to the middleware on run, if applicable
						if (middlewareOptions) {
							middlewares.push((req: FastifyRequest, res: FastifyReply, next: HookHandlerDoneFunction) =>
								importedMiddleware.default(req, res, next, middlewareOptions)
							);
						} else {
							middlewares.push(importedMiddleware.default);
						}
					}
				}

				// Insert built middlewares array into route's options object
				if (options.debug) {
					server.log.debug(inspect(options));
				}

				// Check one last time if there's a schema attached to the options object
				if (!schema && options.schema) {
					schema = options.schema;
				}

				// Register the route in fastify
				server.route({
					method: options.method.toUpperCase() as any,
					url: options.url,
					preHandler: middlewares,
					schema: schema ?? {},
					handler: (req: FastifyRequest, res: FastifyReply) => route.run(req, res),
					config: {
						rateLimit: {
							max: options.options?.rateLimit?.max ?? SETTINGS.rateLimitMax,
							timeWindow: options.options?.rateLimit?.timeWindow ?? SETTINGS.rateLimitWindow
						}
					}
				});

				server.log.debug(
					// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
					`Found route |${schema ? ' SCHEMA |' : addSpaces('') + ' |'}${addSpaces(
						options.method.toUpperCase()
					)} ${options.url}`
				);
			} catch (error) {
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				server.log.error(routeFile);
				server.log.error(error);
			}
		}
	}
};
