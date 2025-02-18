import { cookies } from 'next/headers';
import createClient from 'openapi-fetch';
import { ENV } from '@/util/env';
import type { paths } from '@/util/openapiSchema';

const openAPIClient = createClient<paths>({
	baseUrl: ENV.BASE_API_URL!
});

openAPIClient.use({
	onRequest(req) {
		req.headers.set('authorization', `Bearer ${cookies().get('token')?.value}`);
		return req;
	},
	onResponse(res) {
		if (res.url.endsWith('/api/v1/auth/login')) {
			return res;
		}

		return res;
	}
});

export { openAPIClient };
