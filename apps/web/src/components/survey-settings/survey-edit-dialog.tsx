"use client";

import type { SurveySettings } from "@orksys-survey/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { orpc } from "@/utils/orpc";

import { SurveySettingsForm } from "./survey-settings-form";

interface SurveyEditDialogProps {
	surveyId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SurveyEditDialog({
	surveyId,
	open,
	onOpenChange,
}: SurveyEditDialogProps) {
	const queryClient = useQueryClient();

	// Fetch survey data
	const { data: survey, isLoading } = useQuery(
		orpc.survey.getById.queryOptions({ input: { id: surveyId } }),
	);

	const initialSettings = (survey?.settings as SurveySettings) || {};

	const [localTitle, setLocalTitle] = useState("");
	const [localDescription, setLocalDescription] = useState("");
	const [localSettings, setLocalSettings] = useState<SurveySettings>({});

	// Sync form state when survey data loads or dialog opens
	useEffect(() => {
		if (survey && open) {
			setLocalTitle(survey.title);
			setLocalDescription(survey.description || "");
			setLocalSettings((survey.settings as SurveySettings) || {});
		}
	}, [survey, open]);

	const updateMutation = useMutation(
		orpc.survey.update.mutationOptions({
			onSuccess: () => {
				toast.success("Settings saved");
				queryClient.invalidateQueries({ queryKey: ["survey"] });
				queryClient.invalidateQueries({ queryKey: ["surveys"] });
				onOpenChange(false);
			},
			onError: (error) => {
				toast.error(error.message || "Failed to save settings");
			},
		}),
	);

	const handleSave = () => {
		updateMutation.mutate({
			id: surveyId,
			data: {
				title: localTitle,
				description: localDescription || undefined,
				settings: localSettings,
			},
		});
	};

	const handleFormChange = (updates: {
		title?: string;
		description?: string;
		settings?: Partial<SurveySettings>;
	}) => {
		if (updates.title !== undefined) {
			setLocalTitle(updates.title);
		}
		if (updates.description !== undefined) {
			setLocalDescription(updates.description);
		}
		if (updates.settings !== undefined) {
			setLocalSettings({ ...localSettings, ...updates.settings });
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Edit Survey</DialogTitle>
				</DialogHeader>

				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				) : (
					<div className="-mr-2 max-h-[60vh] overflow-y-auto pr-2">
						<SurveySettingsForm
							title={localTitle}
							description={localDescription}
							settings={localSettings}
							onChange={handleFormChange}
						/>
					</div>
				)}

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={updateMutation.isPending}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={updateMutation.isPending || isLoading}
					>
						{updateMutation.isPending ? "Saving..." : "Save changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
