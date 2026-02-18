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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { orpc } from "@/utils/orpc";

import { useSurveyBuilder } from "./index";

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

	const [title, setTitle] = useState(survey.title);
	const [description, setDescription] = useState(survey.description || "");
	const [showProgressBar, setShowProgressBar] = useState(
		initialSettings.showProgressBar ?? true,
	);
	const [showQuestionNumbers, setShowQuestionNumbers] = useState(
		initialSettings.showQuestionNumbers ?? true,
	);
	const [allowMultipleResponses, setAllowMultipleResponses] = useState(
		initialSettings.allowMultipleResponses ?? false,
	);
	const [displayMode, setDisplayMode] = useState<"one_at_a_time" | "list">(
		initialSettings.displayMode ?? "one_at_a_time",
	);
	const [thankYouMessage, setThankYouMessage] = useState(
		initialSettings.thankYouMessage || "",
	);
	const [redirectUrl, setRedirectUrl] = useState(
		initialSettings.redirectUrl || "",
	);

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
		const settings: SurveySettings = {
			showProgressBar,
			showQuestionNumbers,
			allowMultipleResponses,
			displayMode,
			thankYouMessage: thankYouMessage || undefined,
			redirectUrl: redirectUrl || undefined,
		};

		updateMutation.mutate({
			id: survey.id,
			data: {
				title,
				description: description || undefined,
				settings,
			},
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Survey Settings</DialogTitle>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Basic Info */}
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={2}
							/>
						</div>
					</div>

					{/* Display Settings */}
					<div className="space-y-4">
						<h4 className="font-medium text-sm">Display</h4>
						<div className="space-y-2">
							<Label htmlFor="displayMode">Display Mode</Label>
							<Select
								value={displayMode}
								onValueChange={(v) =>
									setDisplayMode(v as "one_at_a_time" | "list")
								}
							>
								<SelectTrigger id="displayMode">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="one_at_a_time">One at a time</SelectItem>
									<SelectItem value="list">All at once (list)</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center justify-between">
							<Label htmlFor="progressBar">Show progress bar</Label>
							<Switch
								id="progressBar"
								checked={showProgressBar}
								onCheckedChange={setShowProgressBar}
							/>
						</div>
						<div className="flex items-center justify-between">
							<Label htmlFor="questionNumbers">Show question numbers</Label>
							<Switch
								id="questionNumbers"
								checked={showQuestionNumbers}
								onCheckedChange={setShowQuestionNumbers}
							/>
						</div>
					</div>

					{/* Response Settings */}
					<div className="space-y-4">
						<h4 className="font-medium text-sm">Responses</h4>
						<div className="flex items-center justify-between">
							<Label htmlFor="multipleResponses">
								Allow multiple responses
							</Label>
							<Switch
								id="multipleResponses"
								checked={allowMultipleResponses}
								onCheckedChange={setAllowMultipleResponses}
							/>
						</div>
					</div>

					{/* Completion Settings */}
					<div className="space-y-4">
						<h4 className="font-medium text-sm">Completion</h4>
						<div className="space-y-2">
							<Label htmlFor="thankYouMessage">Thank you message</Label>
							<Textarea
								id="thankYouMessage"
								value={thankYouMessage}
								onChange={(e) => setThankYouMessage(e.target.value)}
								placeholder="Thank you for your response!"
								rows={2}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="redirectUrl">Redirect URL</Label>
							<Input
								id="redirectUrl"
								value={redirectUrl}
								onChange={(e) => setRedirectUrl(e.target.value)}
								placeholder="https://example.com/thank-you"
							/>
						</div>
					</div>
				</div>

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
