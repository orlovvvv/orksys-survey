import { type LucideIcon, SearchIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type CommandItem = {
	id: string;
	title: string;
	description: string;
	category: string;
	icon?: LucideIcon;
	shortcut?: string;
};

type SearchModalProps = {
	children: React.ReactNode;
	data: CommandItem[];
};

export function SearchModal({ children, data }: SearchModalProps) {
	const [open, setOpen] = React.useState(false);
	const [query, setQuery] = React.useState("");

	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>{children}</DialogTrigger>
			<DialogContent className="p-1">
				<Command className="rounded-md bg-background md:border md:bg-card">
					<CommandInput
						className={cn(
							"flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
						)}
						placeholder="Search..."
						value={query}
						onValueChange={setQuery}
					/>
					<CommandList className="max-h-[380px] min-h-[380px] px-2 md:px-0">
						<CommandEmpty className="flex min-h-[280px] flex-col items-center justify-center">
							<SearchIcon className="mb-2 size-6 text-muted-foreground" />
							<p className="mb-1 text-muted-foreground text-xs">
								No commands found for "{query}"
							</p>
							<Button onClick={() => setQuery("")} variant="ghost">
								Clear search
							</Button>
						</CommandEmpty>
						<CommandGroup>
							{data.map((item, i) => {
								return (
									<CommandItem
										key={i}
										className="flex cursor-pointer items-center gap-3"
										value={item.title}
										onSelect={() => setOpen(false)}
									>
										{item.icon && <item.icon className="size-5" />}
										<div className="flex flex-col">
											<p className="max-w-[250px] truncate font-medium text-sm">
												{item.title}
											</p>
											<p className="text-muted-foreground text-xs">
												{item.description}
											</p>
										</div>
										<p className="ml-auto text-muted-foreground text-xs">
											{item.category}
										</p>
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</DialogContent>
		</Dialog>
	);
}
