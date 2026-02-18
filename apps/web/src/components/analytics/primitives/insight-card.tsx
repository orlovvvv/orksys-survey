import { Loader2, type LucideIcon } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface InsightCardProps {
	title: string;
	description?: string;
	isLoading?: boolean;
	icon?: LucideIcon;
	children: React.ReactNode;
	loadingHeight?: string;
	className?: string;
}

export function InsightCard({
	title,
	description,
	isLoading = false,
	icon: Icon,
	children,
	loadingHeight = "200px",
	className,
}: InsightCardProps) {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					{Icon && <Icon className="h-5 w-5" />}
					{title}
				</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div
						className="flex items-center justify-center"
						style={{ minHeight: loadingHeight }}
					>
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				) : (
					children
				)}
			</CardContent>
		</Card>
	);
}
