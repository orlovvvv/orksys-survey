import type { Question } from "@orksys-survey/db";

/**
 * Validates an answer value against a question's configuration.
 * Returns an error message if invalid, or null if valid.
 *
 * @param question - The question to validate against
 * @param value - The answer value to validate
 * @returns An error message string, or null if the answer is valid
 */
export function validateAnswer(
	question: Question,
	value: unknown,
): string | null {
	// Check required fields
	if (question.required && isEmpty(value)) {
		return "This field is required";
	}

	// Skip further validation if value is empty and not required
	if (isEmpty(value)) {
		return null;
	}

	// Type-specific validation
	switch (question.type) {
		case "email":
			return validateEmail(value);
		case "phone":
			return validatePhone(value);
		case "text":
		case "textarea":
			return validateText(value, question.config);
		case "choice":
			return validateChoice(value, question.config);
		case "multiple_choice":
		case "dropdown":
			return validateSingleChoice(value, question.config);
		case "checkbox":
			return validateMultipleChoice(value, question.config);
		case "rating":
		case "nps":
		case "linear_scale":
			return validateNumericRange(value, question.config);
		case "date":
			return validateDate(value);
		case "file_upload":
			return validateFileUpload(value, question.config);
		default:
			return null;
	}
}

/**
 * Checks if a value is considered empty.
 */
function isEmpty(value: unknown): boolean {
	if (value === null || value === undefined) {
		return true;
	}
	if (typeof value === "string" && value.trim() === "") {
		return true;
	}
	if (Array.isArray(value) && value.length === 0) {
		return true;
	}
	return false;
}

/**
 * Validates email format.
 */
function validateEmail(value: unknown): string | null {
	if (typeof value !== "string") {
		return "Email must be a string";
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(value)) {
		return "Please enter a valid email address";
	}

	return null;
}

/**
 * Validates phone number format.
 * Accepts various international formats with optional country code.
 */
function validatePhone(value: unknown): string | null {
	if (typeof value !== "string") {
		return "Phone number must be a string";
	}

	// Remove common separators and spaces for validation
	const cleaned = value.replace(/[\s\-()+.]/g, "");

	// Accept 7-15 digits with optional + prefix
	const phoneRegex = /^\+?[1-9]\d{6,14}$/;
	if (!phoneRegex.test(cleaned)) {
		return "Please enter a valid phone number";
	}

	return null;
}

/**
 * Validates text input against length constraints.
 */
function validateText(
	value: unknown,
	config: Question["config"],
): string | null {
	if (typeof value !== "string") {
		return "This field must be text";
	}

	const { minLength, maxLength } = config || {};

	if (minLength !== undefined && value.length < minLength) {
		return `Minimum length is ${minLength} characters`;
	}

	if (maxLength !== undefined && value.length > maxLength) {
		return `Maximum length is ${maxLength} characters`;
	}

	return null;
}

/**
 * Validates choice selection based on allowMultiple config.
 */
function validateChoice(
	value: unknown,
	config: Question["config"],
): string | null {
	const allowMultiple = config?.allowMultiple ?? false;

	if (allowMultiple) {
		return validateMultipleChoice(value, config);
	}
	return validateSingleChoice(value, config);
}

/**
 * Validates single choice selection (multiple_choice, dropdown).
 */
function validateSingleChoice(
	value: unknown,
	config: Question["config"],
): string | null {
	if (typeof value !== "string") {
		return "Please select an option";
	}

	// Validate against allowed options if provided
	const options = config?.options;
	if (options && options.length > 0) {
		const isValidOption = options.some(
			(opt) => opt.value === value || (config?.allowOther && value === "other"),
		);
		if (!isValidOption) {
			return "Please select a valid option";
		}
	}

	return null;
}

/**
 * Validates multiple choice selection (checkbox).
 */
function validateMultipleChoice(
	value: unknown,
	config: Question["config"],
): string | null {
	if (!Array.isArray(value)) {
		return "Please select at least one option";
	}

	if (value.length === 0) {
		return "Please select at least one option";
	}

	// Validate against allowed options if provided
	const options = config?.options;
	if (options && options.length > 0) {
		const validValues = new Set(options.map((opt) => opt.value));
		if (config?.allowOther) {
			validValues.add("other");
		}

		const hasInvalidOption = value.some((v) => !validValues.has(v));
		if (hasInvalidOption) {
			return "One or more selected options are invalid";
		}
	}

	return null;
}

/**
 * Validates numeric range (rating, nps, linear_scale).
 */
function validateNumericRange(
	value: unknown,
	config: Question["config"],
): string | null {
	if (typeof value !== "number") {
		return "Please provide a valid number";
	}

	const { min, max } = config || {};

	if (min !== undefined && value < min) {
		return `Value must be at least ${min}`;
	}

	if (max !== undefined && value > max) {
		return `Value must be at most ${max}`;
	}

	return null;
}

/**
 * Validates date input.
 */
function validateDate(value: unknown): string | null {
	if (typeof value !== "string" && !(value instanceof Date)) {
		return "Please provide a valid date";
	}

	const date = typeof value === "string" ? new Date(value) : value;

	if (Number.isNaN(date.getTime())) {
		return "Please provide a valid date";
	}

	return null;
}

/**
 * Validates file upload configuration.
 */
function validateFileUpload(
	value: unknown,
	config: Question["config"],
): string | null {
	if (!Array.isArray(value)) {
		return "File uploads must be an array";
	}

	const { maxFiles, maxFileSize, acceptedFileTypes } = config || {};

	if (maxFiles !== undefined && value.length > maxFiles) {
		return `Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""} allowed`;
	}

	// Validate file sizes and types
	for (const file of value) {
		if (typeof file !== "object" || file === null) {
			return "Invalid file data";
		}

		if (maxFileSize !== undefined) {
			const fileSize = (file as { size?: number }).size || 0;
			if (fileSize > maxFileSize) {
				return `File size exceeds maximum of ${maxFileSize} bytes`;
			}
		}

		if (acceptedFileTypes && acceptedFileTypes.length > 0) {
			const fileType = (file as { type?: string }).type;
			if (fileType && !acceptedFileTypes.includes(fileType)) {
				return `File type ${fileType} is not allowed`;
			}
		}
	}

	return null;
}
