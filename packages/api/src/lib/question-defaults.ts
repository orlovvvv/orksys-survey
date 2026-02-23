import type { QuestionConfig } from "@orksys-survey/db";

export type QuestionType =
	| "text"
	| "long_text"
	| "choice"
	| "dropdown"
	| "rating"
	| "nps"
	| "date"
	| "slider"
	| "file_upload"
	| "input"
	| "textarea"
	| "select"
	| "radio_group"
	| "checkbox_group"
	| "switch"
	| "date_picker"
	| "combobox"
	| "otp"
	| "multiple_choice"
	| "checkbox"
	| "email"
	| "phone"
	| "linear_scale";

export function getDefaultConfigForQuestionType(
	type: QuestionType,
): QuestionConfig {
	switch (type) {
		case "text":
		case "long_text":
		case "input":
		case "textarea":
			return { placeholder: "" };

		case "choice":
		case "dropdown":
		case "select":
		case "radio_group":
		case "checkbox_group":
		case "combobox":
		case "multiple_choice":
		case "checkbox":
			return {
				options: [
					{ label: "Option 1", value: "option_1" },
					{ label: "Option 2", value: "option_2" },
				],
				allowMultiple: [
					"checkbox_group",
					"checkbox",
					"multiple_choice",
				].includes(type),
				searchable: type === "combobox",
			};

		case "rating":
			return { min: 1, max: 5 };

		case "nps":
			return { min: 0, max: 10 };

		case "slider":
		case "linear_scale":
			return { min: 1, max: 5, step: 1 };

		case "file_upload":
			return {
				maxFiles: 1,
				maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
				acceptedFileTypes: [],
			};

		case "date":
		case "date_picker":
		case "email":
		case "phone":
			return { placeholder: "" };

		case "switch":
			return { defaultValue: false };

		default:
			return {};
	}
}
