import createClient from 'openapi-fetch';
import { ENV } from '@/util/env';
import type { paths } from '@/util/openapiSchema';

const openAPIClient = createClient<paths>({
	baseUrl: ENV.BASE_API_URL!,
	credentials: 'include'
});

export { openAPIClient };
