"use client";

import type { Question } from "@orksys-survey/db";
import { useSurveyRunner } from "./context";

interface QuestionRendererProps {
	question: Question;
}

// Placeholder components for each question type
// These will be replaced with full implementations
function TextQuestion({
	question,
	value,
	onChange,
	error,
}: {
	question: Question;
	value: string | undefined;
	onChange: (value: string) => void;
	error?: string | null;
}) {
	return (
		<div className="space-y-2">
			<label className="block font-medium text-neutral-900">
				{question.title}
				{question.required && <span className="ml-1 text-red-500">*</span>}
			</label>
			{question.description && (
				<p className="text-neutral-600 text-sm">{question.description}</p>
			)}
			<input
				type="text"
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
				placeholder={question.config?.placeholder}
				className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
			/>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);
}

function TextareaQuestion({
	question,
	value,
	onChange,
	error,
}: {
	question: Question;
	value: string | undefined;
	onChange: (value: string) => void;
	error?: string | null;
}) {
	return (
		<div className="space-y-2">
			<label className="block font-medium text-neutral-900">
				{question.title}
				{question.required && <span className="ml-1 text-red-500">*</span>}
			</label>
			{question.description && (
				<p className="text-neutral-600 text-sm">{question.description}</p>
			)}
			<textarea
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
				placeholder={question.config?.placeholder}
				rows={4}
				className="w-full resize-none rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
			/>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);
}

function ChoiceQuestion({
	question,
	value,
	onChange,
	error,
}: {
	question: Question;
	value: string | undefined;
	onChange: (value: string) => void;
	error?: string | null;
}) {
	const options = question.config?.options ?? [];

	return (
		<div className="space-y-2">
			<label className="block font-medium text-neutral-900">
				{question.title}
				{question.required && <span className="ml-1 text-red-500">*</span>}
			</label>
			{question.description && (
				<p className="text-neutral-600 text-sm">{question.description}</p>
			)}
			<div className="mt-3 space-y-2">
				{options.map((option) => (
					<label
						key={option.value}
						className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 p-3 transition-colors hover:bg-neutral-50 has-[:checked]:border-neutral-500 has-[:checked]:bg-neutral-50"
					>
						<input
							type="radio"
							name={question.id}
							value={option.value}
							checked={value === option.value}
							onChange={(e) => onChange(e.target.value)}
							className="h-4 w-4 text-neutral-900"
						/>
						<span className="text-neutral-900">{option.label}</span>
					</label>
				))}
			</div>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);
}

function CheckboxQuestion({
	question,
	value,
	onChange,
	error,
}: {
	question: Question;
	value: string[] | undefined;
	onChange: (value: string[]) => void;
	error?: string | null;
}) {
	const options = question.config?.options ?? [];
	const selectedValues = value ?? [];

	const handleToggle = (optionValue: string) => {
		if (selectedValues.includes(optionValue)) {
			onChange(selectedValues.filter((v) => v !== optionValue));
		} else {
			onChange([...selectedValues, optionValue]);
		}
	};

	return (
		<div className="space-y-2">
			<label className="block font-medium text-neutral-900">
				{question.title}
				{question.required && <span className="ml-1 text-red-500">*</span>}
			</label>
			{question.description && (
				<p className="text-neutral-600 text-sm">{question.description}</p>
			)}
			<div className="mt-3 space-y-2">
				{options.map((option) => (
					<label
						key={option.value}
						className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 p-3 transition-colors hover:bg-neutral-50 has-[:checked]:border-neutral-500 has-[:checked]:bg-neutral-50"
					>
						<input
							type="checkbox"
							checked={selectedValues.includes(option.value)}
							onChange={() => handleToggle(option.value)}
							className="h-4 w-4 rounded text-neutral-900"
						/>
						<span className="text-neutral-900">{option.label}</span>
					</label>
				))}
			</div>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);
}

function DropdownQuestion({
	question,
	value,
	onChange,
	error,
}: {
	question: Question;
	value: string | undefined;
	onChange: (value: string) => void;
	error?: string | null;
}) {
	const options = question.config?.options ?? [];

	return (
		<div className="space-y-2">
			<label className="block font-medium text-neutral-900">
				{question.title}
				{question.required && <span className="ml-1 text-red-500">*</span>}
			</label>
			{question.description && (
				<p className="text-neutral-600 text-sm">{question.description}</p>
			)}
			<select
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
				className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
			>
				<option value="">Select an option</option>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);
}

function RatingQuestion({
	question,
	value,
	onChange,
	error,
}: {
	question: Question;
	value: number | undefined;
	onChange: (value: number) => void;
	error?: string | null;
}) {
	const max = question.config?.max ?? 5;

	return (
		<div className="space-y-2">
			<label className="block font-medium text-neutral-900">
				{question.title}
				{question.required && <span className="ml-1 text-red-500">*</span>}
			</label>
			{question.description && (
				<p className="text-neutral-600 text-sm">{question.description}</p>
			)}
			<div className="mt-3 flex gap-2">
				{Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
					<button
						key={rating}
						type="button"
						onClick={() => onChange(rating)}
						className={`h-10 w-10 rounded-lg border font-medium text-sm transition-colors ${
							value === rating
								? "border-neutral-900 bg-neutral-900 text-white"
								: "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
						}`}
					>
						{rating}
					</button>
				))}
			</div>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);
}

function NpsQuestion({
	question,
	value,
	onChange,
	error,
}: {
	question: Question;
	value: number | undefined;
	onChange: (value: number) => void;
	error?: string | null;
}) {
	return (
		<div className="space-y-2">
			<label className="block font-medium text-neutral-900">
				{question.title}
				{question.required && <span className="ml-1 text-red-500">*</span>}
			</label>
			{question.description && (
				<p className="text-neutral-600 text-sm">{question.description}</p>
			)}
			<div className="mt-3 flex gap-1">
				{Array.from({ length: 11 }, (_, i) => i).map((rating) => (
					<button
						key={rating}
						type="button"
						onClick={() => onChange(rating)}
						className={`h-10 w-10 rounded-lg border font-medium text-sm transition-colors ${
							value === rating
								? "border-neutral-900 bg-neutral-900 text-white"
								: "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
						}`}
					>
						{rating}
					</button>
				))}
			</div>
			<div className="mt-1 flex justify-between text-neutral-500 text-xs">
				<span>0 = Not likely</span>
				<span>10 = Very likely</span>
			</div>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);
}

function LinearScaleQuestion({
	question,
	value,
	onChange,
	error,
}: {
	question: Question;
	value: number | undefined;
	onChange: (value: number) => void;
	error?: string | null;
}) {
	const min = question.config?.min ?? 1;
	const max = question.config?.max ?? 10;

	return (
		<div className="space-y-2">
			<label className="block font-medium text-neutral-900">
				{question.title}
				{question.required && <span className="ml-1 text-red-500">*</span>}
			</label>
			{question.description && (
				<p className="text-neutral-600 text-sm">{question.description}</p>
			)}
			<div className="mt-3 flex items-center gap-4">
				<span className="text-neutral-500 text-sm">{min}</span>
				<input
					type="range"
					min={min}
					max={max}
					value={value ?? min}
					onChange={(e) => onChange(Number(e.target.value))}
					className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-neutral-200"
				/>
				<span className="text-neutral-500 text-sm">{max}</span>
			</div>
			<p className="text-center font-medium text-neutral-700">
				Selected: {value ?? min}
			</p>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);
}

function DateQuestion({
	question,
	value,
	onChange,
	error,
}: {
	question: Question;
	value: string | undefined;
	onChange: (value: string) => void;
	error?: string | null;
}) {
	return (
		<div className="space-y-2">
			<label className="block font-medium text-neutral-900">
				{question.title}
				{question.required && <span className="ml-1 text-red-500">*</span>}
			</label>
			{question.description && (
				<p className="text-neutral-600 text-sm">{question.description}</p>
			)}
			<input
				type="date"
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
				className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
			/>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);
}

function EmailQuestion({
	question,
	value,
	onChange,
	error,
}: {
	question: Question;
	value: string | undefined;
	onChange: (value: string) => void;
	error?: string | null;
}) {
	return (
		<div className="space-y-2">
			<label className="block font-medium text-neutral-900">
				{question.title}
				{question.required && <span className="ml-1 text-red-500">*</span>}
			</label>
			{question.description && (
				<p className="text-neutral-600 text-sm">{question.description}</p>
			)}
			<input
				type="email"
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
				placeholder={question.config?.placeholder ?? "email@example.com"}
				className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
			/>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);
}

function PhoneQuestion({
	question,
	value,
	onChange,
	error,
}: {
	question: Question;
	value: string | undefined;
	onChange: (value: string) => void;
	error?: string | null;
}) {
	return (
		<div className="space-y-2">
			<label className="block font-medium text-neutral-900">
				{question.title}
				{question.required && <span className="ml-1 text-red-500">*</span>}
			</label>
			{question.description && (
				<p className="text-neutral-600 text-sm">{question.description}</p>
			)}
			<input
				type="tel"
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
				placeholder={question.config?.placeholder ?? "+1 (555) 000-0000"}
				className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
			/>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);
}

function FileUploadQuestion({
	question,
	value: _value,
	onChange: _onChange,
	error,
}: {
	question: Question;
	value: unknown;
	onChange: (value: unknown) => void;
	error?: string | null;
}) {
	const maxFiles = question.config?.maxFiles ?? 1;

	return (
		<div className="space-y-2">
			<label className="block font-medium text-neutral-900">
				{question.title}
				{question.required && <span className="ml-1 text-red-500">*</span>}
			</label>
			{question.description && (
				<p className="text-neutral-600 text-sm">{question.description}</p>
			)}
			<div className="mt-3 flex justify-center rounded-lg border border-neutral-300 border-dashed px-6 py-10">
				<div className="text-center">
					<p className="text-neutral-600 text-sm">
						Drag and drop files here, or click to select
					</p>
					<p className="mt-1 text-neutral-500 text-xs">
						Up to {maxFiles} file{maxFiles > 1 ? "s" : ""}
					</p>
				</div>
			</div>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);
}

export function QuestionRenderer({ question }: QuestionRendererProps) {
	const { answers, setAnswer, currentError } = useSurveyRunner();
	const value = answers.get(question.id);
	const error = currentError;

	const handleChange = (newValue: unknown) => {
		setAnswer(question.id, newValue);
	};

	switch (question.type) {
		case "text":
			return (
				<TextQuestion
					question={question}
					value={value as string | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "textarea":
			return (
				<TextareaQuestion
					question={question}
					value={value as string | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "multiple_choice":
			return (
				<ChoiceQuestion
					question={question}
					value={value as string | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "checkbox":
			return (
				<CheckboxQuestion
					question={question}
					value={value as string[] | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "dropdown":
			return (
				<DropdownQuestion
					question={question}
					value={value as string | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "rating":
			return (
				<RatingQuestion
					question={question}
					value={value as number | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "nps":
			return (
				<NpsQuestion
					question={question}
					value={value as number | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "linear_scale":
			return (
				<LinearScaleQuestion
					question={question}
					value={value as number | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "date":
			return (
				<DateQuestion
					question={question}
					value={value as string | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "email":
			return (
				<EmailQuestion
					question={question}
					value={value as string | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "phone":
			return (
				<PhoneQuestion
					question={question}
					value={value as string | undefined}
					onChange={(v) => handleChange(v)}
					error={error}
				/>
			);
		case "file_upload":
			return (
				<FileUploadQuestion
					question={question}
					value={value}
					onChange={handleChange}
					error={error}
				/>
			);
		default:
			return (
				<div className="text-neutral-500">
					Unknown question type: {question.type}
				</div>
			);
	}
}
