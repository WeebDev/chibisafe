import { openAPIClient } from '@/lib/serverFetch';

export const GlobalBackground = async () => {
	const { data, error } = await openAPIClient.GET('/api/v1/settings');

	if (error) {
		return null;
	}

	if (data?.siteBackgroundUrl.value) {
		return (
			<div
				className="fixed inset-0 z-[-1] bg-no-repeat bg-center bg-cover"
				style={{ backgroundImage: `url(${data.siteBackgroundUrl.value})` }}
			/>
		);
	}

	return null;
};
