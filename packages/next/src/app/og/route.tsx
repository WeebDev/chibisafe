/* eslint-disable react/no-unknown-property */
import { ImageResponse } from 'next/og';
import { ChibisafeDefaultLogo } from '@/components/svg/ChibisafeLogo';
import { openAPIClient } from '@/lib/serverFetch';

export const contentType = 'image/jpeg';
export const runtime = 'edge';
export const size = {
	width: 1200,
	height: 630
};

const getFontSans = async () => {
	const response = await fetch(new URL('@/assets/fonts/CalSans-SemiBold.ttf', import.meta.url));
	return response.arrayBuffer();
};

const getFontInter = async () => {
	const response = await fetch(new URL('@/assets/fonts/Inter-ExtraLight.ttf', import.meta.url));
	return response.arrayBuffer();
};

export async function GET(request: Request) {
	const url = new URL(request.url);
	const section = url.searchParams.get('section') ?? null;

	const { data, error } = await openAPIClient.GET('/api/v1/settings');
	if (error) {
		return null;
	}

	return new ImageResponse(
		(
			<div tw="flex flex-col w-full h-full items-center justify-center relative">
				{data.siteBackgroundUrl.value ? (
					<div
						style={{
							backgroundImage: `url(${data.siteBackgroundUrl.value})`,
							position: 'absolute',
							backgroundRepeat: 'no-repeat',
							backgroundPosition: 'center',
							backgroundSize: 'cover',
							backgroundColor: '#030711',
							width: '100%',
							height: '100%'
						}}
					/>
				) : (
					<div
						tw="flex"
						style={{
							position: 'absolute',
							backgroundColor: '#030711',
							width: '100%',
							height: '100%',
							padding: '4rem'
						}}
					>
						<div
							style={{
								width: '100%',
								height: '100%',
								backgroundImage:
									"url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3e%3ccircle fill='%23262626' id='pattern-circle' cx='10' cy='10' r='2.5'%3e%3c/circle%3e%3c/svg%3e\")",
								backgroundRepeat: 'repeat'
							}}
						/>
					</div>
				)}
				{section ? (
					<div tw="flex absolute bottom-12 left-12 items-center">
						{data.siteLogoUrl.value ? (
							<picture>
								<img tw="w-44 h-44" src={data.siteLogoUrl.value} />
							</picture>
						) : (
							<ChibisafeDefaultLogo width="175px" height="184px" />
						)}

						<h1
							tw="text-[100px] text-white ml-6"
							style={{
								fontFamily: 'CalSans'
							}}
						>
							{data.siteName.value}
						</h1>
						<h2 tw="text-[100px] text-white ml-4 pt-6 tracking-tighter" style={{ fontFamily: 'Inter' }}>
							{section?.split('-').join(' ')}
						</h2>
					</div>
				) : (
					<div tw="flex w-full justify-center items-center flex-col">
						{data.siteLogoUrl.value ? (
							<picture tw="mt-4">
								<img tw="w-52 h-52" src={data.siteLogoUrl.value} />
							</picture>
						) : (
							<picture tw="mt-4">
								<ChibisafeDefaultLogo />
							</picture>
						)}
						<h1 tw="text-[100px] text-white" style={{ fontFamily: 'CalSans' }}>
							{data.siteName.value}
						</h1>
					</div>
				)}
			</div>
		),
		{
			...size,
			fonts: [
				{
					name: 'CalSans',
					data: await getFontSans(),
					style: 'normal'
				},
				{
					name: 'Inter',
					data: await getFontInter(),
					style: 'normal'
				}
			]
		}
	);
}
