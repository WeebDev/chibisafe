import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { readFileSync } from 'node:fs';

const withMDX = createMDX({
	// Add markdown plugins here, as desired
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter]
	}
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: 'standalone',
	pageExtensions: ['mdx', 'ts', 'tsx'],
	env: {
		NEXT_PUBLIC_VERSION: JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version,
		NEXT_PUBLIC_BASE_API_URL: process.env.BASE_API_URL
	},
	experimental: {
		ppr: true
	},
	logging: {
		fetches: {
			fullUrl: true
		}
	},
	images: {
		// TODO: Enable from anywhere or find a better way to configure it
		// this is used to be able to use <Image> with external URLs
		// remotePatterns: [
		// 	{
		// 		protocol: 'http',
		// 		hostname: 'localhost'
		// 	}
		// ]
		dangerouslyAllowSVG: true,
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; frame-src 'none'; sandbox;",
		remotePatterns: [
			{
				protocol: 'http',
				hostname: '**'
				// port: '3001'
			}
		]
	},
	async rewrites() {
		return process.env.NODE_ENV === 'production'
			? []
			: [
					{
						source: '/api/:path*',
						destination: `${process.env.BASE_API_URL}/api/:path*`
					}
				];
	},
	eslint: {
		ignoreDuringBuilds: true
	},
	typescript: {
		ignoreBuildErrors: true
	}
};

export default withMDX(nextConfig);
