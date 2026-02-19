"use client";

import type { Question } from "@orksys-survey/db";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList } from "lucide-react";

import { QuestionRenderer } from "@/components/survey-runner/questions";
import { Card, CardContent } from "@/components/ui/card";

import { PreviewProvider } from "./preview-context";

interface PreviewCanvasProps {
	questions: Question[];
}

export function PreviewCanvas({ questions }: PreviewCanvasProps) {
	const safeQuestions = questions || [];

	return (
		<div className="flex flex-1 items-center justify-center overflow-y-auto bg-muted/30 p-8">
			<div className="w-full max-w-2xl">
				<AnimatePresence mode="popLayout">
					{safeQuestions.length === 0 ? (
						<motion.div
							key="empty-preview"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.2 }}
						>
							<Card className="border-dashed">
								<CardContent className="flex flex-col items-center justify-center py-16">
									<ClipboardList className="mb-4 h-12 w-12 text-muted-foreground/50" />
									<p className="text-muted-foreground">
										Add questions to preview your survey
									</p>
								</CardContent>
							</Card>
						</motion.div>
					) : (
						<PreviewProvider>
							<div className="space-y-6">
								{safeQuestions.map((question, index) => (
									<motion.div
										key={question.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, x: -100 }}
										transition={{ duration: 0.2, delay: index * 0.05 }}
										layout
									>
										<Card>
											<CardContent className="p-6">
												<span className="mb-3 block font-bold text-[10px] text-primary uppercase tracking-widest">
													Question {index + 1} of {safeQuestions.length}
												</span>
												<QuestionRenderer question={question} />
											</CardContent>
										</Card>
									</motion.div>
								))}
							</div>
						</PreviewProvider>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
