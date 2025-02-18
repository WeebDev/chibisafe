'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';

// https://github.com/mxkaske/mxkaske.dev/blob/main/components/craft/fancy-multi-select.tsx
type Option = Record<'label' | 'value', string>;

export function FancyMultiSelect({
	options,
	placeholder = 'Select option...',
	initialSelected = [],
	onSelected,
	onRemoved
}: {
	readonly initialSelected?: string[];
	onRemoved(removed: string): void;
	onSelected(selected: string): void;
	readonly options: Option[];
	readonly placeholder?: string;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<Option[]>(
		initialSelected.length ? options.filter(option => initialSelected.includes(option.value)) : []
	);
	const [inputValue, setInputValue] = useState('');
	const [selectables, setSelectables] = useState<Option[]>(options.filter(option => !selected.includes(option)));

	console.log('Rerender 💢');

	useEffect(() => {
		if (!initialSelected.length) return;
		setSelected(options.filter(option => initialSelected.includes(option.value)));
	}, [options, initialSelected]);

	const handleUnselect = useCallback(
		(option: Option) => {
			setSelected(prev => prev.filter(s => s.value !== option.value));
			setSelectables(prev => [...prev, option]);
			onRemoved(option.value);
		},
		[onRemoved]
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			const input = inputRef.current;
			if (input) {
				if ((e.key === 'Delete' || e.key === 'Backspace') && input.value === '') {
					const lastValue = selected[selected.length - 1];
					setSelected(prev => {
						const newSelected = [...prev];
						newSelected.pop();
						return newSelected;
					});

					if (lastValue) {
						setSelectables(prev => [...prev, lastValue]);
						onRemoved(lastValue.value);
					}
				}

				// This is not a default behaviour of the <input /> field
				if (e.key === 'Escape') {
					input.blur();
				}
			}
		},
		[onRemoved, selected]
	);

	const makeSelection = useCallback(
		(option: Option) => {
			setInputValue('');
			setSelected(prev => [...prev, option]);
			setSelectables(prev => prev.filter(s => s.value !== option.value));
			onSelected(option.value);
		},
		[onSelected]
	);

	return (
		<Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
			<div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
				<div className="flex gap-1 flex-wrap">
					{selected.map(option => {
						return (
							<Badge key={option.value} variant="secondary">
								{option.label}
								<button
									type="button"
									className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
									onKeyDown={e => {
										if (e.key === 'Enter') {
											handleUnselect(option);
										}
									}}
									onMouseDown={e => {
										e.preventDefault();
										e.stopPropagation();
									}}
									onClick={() => handleUnselect(option)}
								>
									<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
								</button>
							</Badge>
						);
					})}
					<CommandPrimitive.Input
						ref={inputRef}
						value={inputValue}
						onValueChange={setInputValue}
						onBlur={() => setOpen(false)}
						onFocus={() => setOpen(true)}
						placeholder={placeholder}
						className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
					/>
				</div>
			</div>
			<div className="relative mt-2">
				<CommandList>
					{open && selectables.length > 0 ? (
						<div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
							<CommandGroup className="h-full overflow-auto">
								{selectables.map(option => {
									return (
										<CommandItem
											key={option.value}
											onMouseDown={e => {
												e.preventDefault();
												e.stopPropagation();
											}}
											onSelect={() => makeSelection(option)}
											className={'cursor-pointer'}
											value={option.value}
										>
											{option.label}
										</CommandItem>
									);
								})}
							</CommandGroup>
						</div>
					) : null}
				</CommandList>
			</div>
		</Command>
	);
}
