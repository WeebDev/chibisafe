import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import { readFileSync } from 'node:fs';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const withMDX = createMDX({
	// Add markdown plugins here, as desired
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [
			rehypeSlug,
			rehypeAutolinkHeadings,
			[
				rehypePrettyCode,
				{
					theme: 'github-dark',
					onVisitLine(node) {
						// Prevent lines from collapsing in `display: grid` mode, and allow empty
						// lines to be copy/pasted
						if (node.children.length === 0) {
							node.children = [{ type: 'text', value: ' ' }];
						}
					},
					onVisitHighlightedLine(node) {
						node.properties.className.push('line--highlighted');
					},
					onVisitHighlightedWord(node) {
						node.properties.className = ['word--highlighted'];
					}
				}
			]
		]
	}
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: 'standalone',
	pageExtensions: ['mdx', 'ts', 'tsx'],
	env: {
		NEXT_PUBLIC_VERSION: JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version
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
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost'
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
