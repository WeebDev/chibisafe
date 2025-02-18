import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '../../ui/form';
import { Switch } from '../../ui/switch';
import type { Setting } from '../SettingsForm';

export const FormFieldBoolean = ({ form, data }: { readonly data: Setting; readonly form: any }) => {
	return (
		<FormField
			control={form.control}
			name={data.key}
			render={({ field }) => (
				<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-background">
					<div className="space-y-0.5">
						<FormLabel className="text-base">{data.name}</FormLabel>
						<FormDescription>{data.description}</FormDescription>
						{data.example ? (
							<FormDescription className="italic">Example value: {data.example}</FormDescription>
						) : null}
						{data.notice ? (
							<FormDescription className="border-l-2 px-2 border-yellow-500 text-yellow-500">
								{data.notice}
							</FormDescription>
						) : null}
					</div>
					<FormControl>
						<Switch checked={field.value} onCheckedChange={field.onChange} />
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
