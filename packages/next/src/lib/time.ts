import { format } from '@formkit/tempo';

export const getUptime = (seconds: number) => {
	const days = Math.floor(seconds / (3600 * 24));
	const hours = Math.floor((seconds % (3600 * 24)) / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secondsLeft = Math.floor(seconds % 60);
	return `${days}d ${hours}h ${minutes}m ${secondsLeft}s`;
};

export const getDate = (date: Record<string, unknown> | string) => {
	if (!date?.length) return 'N/A';
	return format(date as string, { date: 'medium', time: 'short' });
};

export const isValidDate = (date: Record<string, unknown> | string) => {
	return new Date(date as string).getTime() > 0;
};
