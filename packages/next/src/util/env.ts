export const ENV = {
	IS_LOCAL_DEV: process.env.VERCEL_ENV === 'development' || process.env.NODE_ENV === 'development',
	IS_STAGING: process.env.STAGING === 'true',
	IS_PREVIEW: process.env.VERCEL_ENV === 'preview',
	BASE_API_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : process.env.BASE_API_URL ?? ''
};
