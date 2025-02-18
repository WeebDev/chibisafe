import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input';
import type { Setting } from '../SettingsForm';

export const FormFieldNumber = ({ form, data }: { readonly data: Setting; readonly form: any }) => {
	return (
		<FormField
			control={form.control}
			name={data.key}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{data.name}</FormLabel>
					<FormControl>
						<Input placeholder={data.example ?? ''} {...field} type="number" />
					</FormControl>
					<FormDescription>{data.description}</FormDescription>
					{data.example ? (
						<FormDescription className="italic">Example value: {data.example}</FormDescription>
					) : null}
					{data.notice ? (
						<FormDescription className="border-l-2 px-2 border-yellow-500 text-yellow-500">
							{data.notice}
						</FormDescription>
					) : null}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
