import { QuestionField } from "./question-field";
import type { BaseQuestionProps } from "./types";

export function FileUploadQuestion({ question, error }: BaseQuestionProps) {
	const maxFiles = question.config?.maxFiles ?? 1;

	return (
		<QuestionField question={question} error={error}>
			<div className="mt-3 flex justify-center rounded-lg border border-input border-dashed px-6 py-10">
				<div className="text-center">
					<p className="text-muted-foreground text-sm">
						Drag and drop files here, or click to select
					</p>
					<p className="mt-1 text-muted-foreground text-xs">
						Up to {maxFiles} file{maxFiles > 1 ? "s" : ""}
					</p>
				</div>
			</div>
		</QuestionField>
	);
}
