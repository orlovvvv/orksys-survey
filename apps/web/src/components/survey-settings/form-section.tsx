import type { ReactNode } from "react";

export interface FormSectionProps {
	title: string;
	children: ReactNode;
}

export function FormSection({ title, children }: FormSectionProps) {
	return (
		<div className="space-y-4">
			<h4 className="font-medium text-sm">{title}</h4>
			{children}
		</div>
	);
}
