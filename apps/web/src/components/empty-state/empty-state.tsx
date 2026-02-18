import { cn } from "@/lib/utils";

interface EmptyStateProps {
	icon?: React.ElementType;
	title: string;
	description?: string;
	action?: React.ReactNode;
	className?: string;
}

export function EmptyState({
	icon: Icon,
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center py-12 text-center",
				className,
			)}
		>
			{Icon && (
				<Icon className="text-muted-foreground/50 mb-4 h-12 w-12" />
			)}
			<h3 className="font-medium text-lg">{title}</h3>
			{description && (
				<p className="text-muted-foreground mt-1 text-sm">{description}</p>
			)}
			{action && <div className="mt-4">{action}</div>}
		</div>
	);
}
