import type { Question } from "@orksys-survey/db";

export interface BaseQuestionProps {
	question: Question;
	value: unknown;
	onChange: (value: unknown) => void;
	error?: string | null;
}

export interface TextQuestionProps
	extends Omit<BaseQuestionProps, "value" | "onChange"> {
	value: string | undefined;
	onChange: (value: string) => void;
}

export interface NumberQuestionProps
	extends Omit<BaseQuestionProps, "value" | "onChange"> {
	value: number | undefined;
	onChange: (value: number) => void;
}

export interface ArrayQuestionProps
	extends Omit<BaseQuestionProps, "value" | "onChange"> {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}
