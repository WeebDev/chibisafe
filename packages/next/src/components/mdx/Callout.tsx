import { cn } from '@/lib/utils';

interface CalloutProps {
	readonly children?: React.ReactNode;
	readonly className?: string;
	readonly icon?: string;
	readonly type?: 'danger' | 'default' | 'warning';
}

export function Callout({ children, icon, type = 'default', className, ...props }: CalloutProps) {
	return (
		<div
			className={cn(
				'my-6 flex items-start rounded-md border border-l-4 p-4',
				{
					'border-red-900': type === 'danger',
					'border-yellow-900': type === 'warning'
				},
				className
			)}
			{...props}
		>
			{icon && <span className="mr-4 text-2xl">{icon}</span>}
			<div>{children}</div>
		</div>
	);
}
