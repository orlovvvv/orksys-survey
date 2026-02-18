"use client";

import type { SurveySettings } from "@orksys-survey/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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

import { useSurveyBuilder } from "./index";
import { SurveySettingsForm } from "./survey-settings-form";

interface SurveySettingsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SurveySettingsDialog({
	open,
	onOpenChange,
}: SurveySettingsDialogProps) {
	const { survey } = useSurveyBuilder();
	const queryClient = useQueryClient();

	const initialSettings = (survey.settings as SurveySettings) || {};

	const [localTitle, setLocalTitle] = useState(survey.title);
	const [localDescription, setLocalDescription] = useState(
		survey.description || "",
	);
	const [localSettings, setLocalSettings] = useState(initialSettings);

	// Reset form when dialog opens
	const [wasOpen, setWasOpen] = useState(open);
	if (open && !wasOpen) {
		setLocalTitle(survey.title);
		setLocalDescription(survey.description || "");
		setLocalSettings(initialSettings);
		setWasOpen(true);
	}
	if (!open && wasOpen) {
		setWasOpen(false);
	}

	const updateMutation = useMutation(
		orpc.survey.update.mutationOptions({
			onSuccess: () => {
				toast.success("Settings saved");
				queryClient.invalidateQueries({ queryKey: ["survey"] });
				onOpenChange(false);
			},
			onError: (error) => {
				toast.error(error.message || "Failed to save settings");
			},
		}),
	);

	const handleSave = () => {
		updateMutation.mutate({
			id: survey.id,
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
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Survey Settings</DialogTitle>
				</DialogHeader>

				<SurveySettingsForm
					title={localTitle}
					description={localDescription}
					settings={localSettings}
					onChange={handleFormChange}
				/>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={updateMutation.isPending}
					>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={updateMutation.isPending}>
						{updateMutation.isPending ? "Saving..." : "Save changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
