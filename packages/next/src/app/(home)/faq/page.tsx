import { CustomMDX } from '@/components/mdx/Mdx';
import { getFaq } from '@/lib/mdx';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
	const posts = getFaq();

	return posts.map(post => ({
		slug: post.slug
	}));
}

export function generateMetadata() {
	const post = getFaq()[0];
	if (!post) {
		return;
	}

	const { title, summary: description, image } = post.metadata;
	const ogImage = image ? image : `/meta.jpg`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'article',
			images: [
				{
					url: ogImage
				}
			]
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage]
		}
	};
}

export default function Faq() {
	const post = getFaq()[0];

	if (!post) {
		return notFound();
	}

	return (
		<section>
			<script
				type="application/ld+json"
				suppressHydrationWarning
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'BlogPosting',
						headline: post.metadata.title,
						description: post.metadata.summary,
						image: post.metadata.image ? post.metadata.image : '/meta.jpg'
					})
				}}
			/>
			<article className="prose">
				<CustomMDX source={post.content} />
			</article>
		</section>
	);
}
