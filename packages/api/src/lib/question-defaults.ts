import type { QuestionConfig } from "@orksys-survey/db";

export type QuestionType =
	| "text"
	| "textarea"
	| "multiple_choice"
	| "checkbox"
	| "dropdown"
	| "rating"
	| "nps"
	| "linear_scale"
	| "date"
	| "email"
	| "phone"
	| "file_upload";

export function getDefaultConfigForQuestionType(
	type: QuestionType,
): QuestionConfig {
	switch (type) {
		case "text":
		case "textarea":
			return { placeholder: "" };

		case "multiple_choice":
		case "checkbox":
		case "dropdown":
			return {
				options: [
					{ label: "Option 1", value: "option_1" },
					{ label: "Option 2", value: "option_2" },
				],
			};

		case "rating":
			return { min: 1, max: 5 };

		case "nps":
			return { min: 0, max: 10 };

		case "linear_scale":
			return { min: 1, max: 5, step: 1 };

		case "file_upload":
			return {
				maxFiles: 1,
				maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
				acceptedFileTypes: [],
			};

		case "date":
		case "email":
		case "phone":
			return { placeholder: "" };

		default:
			return {};
	}
}
