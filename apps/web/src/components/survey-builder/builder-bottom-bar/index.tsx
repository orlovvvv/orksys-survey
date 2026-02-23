"use client";

import type { Question } from "@orksys-survey/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Save, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { orpc } from "@/utils/orpc";
import { SurveyBuilderContext } from "../context";

const springTransition = {
	type: "spring" as const,
	stiffness: 400,
	damping: 30,
	mass: 0.8,
};

export function BuilderBottomBar() {
	const send = SurveyBuilderContext.useActorRef().send;
	const isDirty = SurveyBuilderContext.useSelector((s) => s.context.isDirty);
	const questions = SurveyBuilderContext.useSelector(
		(s) => s.context.questions,
	);
	const survey = SurveyBuilderContext.useSelector((s) => s.context.survey);
	const machineState = SurveyBuilderContext.useSelector((s) => s.value);

	const queryClient = useQueryClient();
	const [discardDialogOpen, setDiscardDialogOpen] = useState(false);

	const isSaving = machineState === "saving";
	const isPublishing = machineState === "publishing";
	const isSaved = machineState === "saved";
	const canPublish = survey.status === "draft" && !isDirty;

	const saveMutation = useMutation(
		orpc.survey.save.mutationOptions({
			onSuccess: () => {
				toast.success("Survey saved successfully");
				send({ type: "SAVE_SUCCESS", questions });
				queryClient.invalidateQueries({ queryKey: ["survey"] });
				queryClient.invalidateQueries({ queryKey: ["question"] });
			},
			onError: (error) => {
				toast.error(error.message || "Failed to save survey");
				send({ type: "SAVE_ERROR", error: error.message || "Failed to save" });
			},
		}),
	);

	const publishMutation = useMutation(
		orpc.survey.changeStatus.mutationOptions({
			onSuccess: () => {
				toast.success("Survey published!");
				send({ type: "PUBLISH_SUCCESS" });
				queryClient.invalidateQueries({ queryKey: ["survey"] });
			},
			onError: (error) => {
				toast.error(error.message || "Failed to publish survey");
				send({
					type: "PUBLISH_ERROR",
					error: error.message || "Failed to publish",
				});
			},
		}),
	);

	const handleSave = () => {
		send({ type: "SAVE" });
		saveMutation.mutate({
			id: survey.id,
			questions: questions.map((q: Question) => ({
				id: q.id,
				type: q.type,
				title: q.title,
				description: q.description,
				config: q.config,
				ruleSetId: q.ruleSetId,
				ruleSetConfigOverrides: q.ruleSetConfigOverrides,
				required: q.required,
				order: q.order,
				isPlaceholder: (q as Question & { isPlaceholder?: boolean })
					.isPlaceholder,
			})) as any,
		});
	};

	const handlePublish = () => {
		send({ type: "PUBLISH" });
		publishMutation.mutate({ id: survey.id, status: "published" });
	};

	const handleDiscard = () => {
		send({ type: "DISCARD_CHANGES" });
		setDiscardDialogOpen(false);
	};

	const showBar = isDirty || isSaved;

	return (
		<AnimatePresence>
			{showBar && (
				<motion.div
					initial={{ opacity: 0, y: 80, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 80, scale: 0.95 }}
					transition={springTransition}
					className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
				>
					<div className="flex items-center gap-3 rounded-xl border bg-background/95 px-4 py-3 shadow-lg backdrop-blur-sm">
						{/* Status indicator */}
						<div className="flex items-center gap-2">
							{isDirty && (
								<>
									<Badge
										variant="secondary"
										className="bg-warning/10 text-warning"
									>
										Unsaved changes
									</Badge>
								</>
							)}
							{isSaved && !isDirty && (
								<Badge
									variant="secondary"
									className="bg-success/10 text-success"
								>
									All changes saved
								</Badge>
							)}
						</div>

						{/* Action buttons */}
						<div className="flex items-center gap-2">
							{/* Discard button */}
							{isDirty && (
								<AlertDialog
									open={discardDialogOpen}
									onOpenChange={setDiscardDialogOpen}
								>
									<AlertDialogTrigger
										render={
											<Button variant="ghost" size="sm" disabled={isSaving}>
												<Trash2 className="mr-2 h-4 w-4" />
												Discard
											</Button>
										}
									/>
									<AlertDialogContent size="sm">
										<AlertDialogHeader>
											<AlertDialogTitle>Discard Changes</AlertDialogTitle>
											<AlertDialogDescription>
												Are you sure you want to discard all unsaved changes?
												This action cannot be undone.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction
												variant="destructive"
												onClick={handleDiscard}
											>
												Discard Changes
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							)}

							{/* Save button */}
							<Button
								variant="default"
								size="sm"
								onClick={handleSave}
								disabled={!isDirty || isSaving}
							>
								{isSaving ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<Save className="mr-2 h-4 w-4" />
								)}
								Save
							</Button>

							{/* Publish button */}
							{canPublish && (
								<Button
									variant="outline"
									size="sm"
									onClick={handlePublish}
									disabled={isPublishing}
								>
									{isPublishing ? (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									) : (
										<Send className="mr-2 h-4 w-4" />
									)}
									Publish
								</Button>
							)}
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
