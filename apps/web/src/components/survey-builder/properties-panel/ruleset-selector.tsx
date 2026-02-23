"use client";

import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { orpc } from "@/utils/orpc";

interface RuleSetSelectorProps {
	value?: string | null;
	onValueChange: (value: string | null) => void;
	type: string;
}

export function RuleSetSelector({
	value,
	onValueChange,
	type,
}: RuleSetSelectorProps) {
	const rulesets = useQuery(orpc.ruleSet.list.queryOptions());

	if (rulesets.isLoading) {
		return <Skeleton className="h-10 w-full" />;
	}

	const filteredRuleSets =
		rulesets.data?.filter((rs) => rs.type === type) || [];

	return (
		<div className="space-y-2">
			<Label className="text-xs uppercase tracking-wide">
				Validation Ruleset
			</Label>
			<Select
				value={value || "none"}
				onValueChange={(val) => onValueChange(val === "none" ? null : val)}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select a ruleset" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="none">None (Standard Input)</SelectItem>
					{filteredRuleSets.map((rs) => (
						<SelectItem key={rs.id} value={rs.id}>
							{rs.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{value && filteredRuleSets.find((rs) => rs.id === value)?.description && (
				<p className="text-[10px] text-muted-foreground italic">
					{filteredRuleSets.find((rs) => rs.id === value)?.description}
				</p>
			)}
		</div>
	);
}
