import type { SurveySettings } from "@orksys-survey/db";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { FormSection } from "./form-section";
import { ToggleField } from "./toggle-field";

interface SurveySettingsFormProps {
	title: string;
	description: string;
	settings: SurveySettings;
	onChange: (updates: {
		title?: string;
		description?: string;
		settings?: Partial<SurveySettings>;
	}) => void;
}

const SettingsForm = {
	Section: FormSection,
	Toggle: ToggleField,
};

export function SurveySettingsForm({
	title,
	description,
	settings,
	onChange,
}: SurveySettingsFormProps) {
	return (
		<div className="space-y-6 py-4">
			{/* Basic Info */}
			<SettingsForm.Section title="Basic Info">
				<div className="space-y-2">
					<Label htmlFor="title">Title</Label>
					<Input
						id="title"
						value={title}
						onChange={(e) => onChange({ title: e.target.value })}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						value={description}
						onChange={(e) => onChange({ description: e.target.value })}
						rows={2}
					/>
				</div>
			</SettingsForm.Section>

			{/* Display Settings */}
			<SettingsForm.Section title="Display">
				<div className="space-y-2">
					<Label htmlFor="displayMode">Display Mode</Label>
					<Select
						value={settings.displayMode ?? "one_at_a_time"}
						onValueChange={(v) =>
							onChange({
								settings: {
									...settings,
									displayMode: v as "one_at_a_time" | "list",
								},
							})
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
				<SettingsForm.Toggle
					id="progressBar"
					label="Show progress bar"
					checked={settings.showProgressBar}
					onChange={(checked) =>
						onChange({
							settings: { ...settings, showProgressBar: checked },
						})
					}
				/>
				<SettingsForm.Toggle
					id="questionNumbers"
					label="Show question numbers"
					checked={settings.showQuestionNumbers}
					onChange={(checked) =>
						onChange({
							settings: {
								...settings,
								showQuestionNumbers: checked,
							},
						})
					}
				/>
			</SettingsForm.Section>

			{/* Response Settings */}
			<SettingsForm.Section title="Responses">
				<SettingsForm.Toggle
					id="multipleResponses"
					label="Allow multiple responses"
					checked={settings.allowMultipleResponses}
					onChange={(checked) =>
						onChange({
							settings: {
								...settings,
								allowMultipleResponses: checked,
							},
						})
					}
				/>
			</SettingsForm.Section>

			{/* Completion Settings */}
			<SettingsForm.Section title="Completion">
				<div className="space-y-2">
					<Label htmlFor="thankYouMessage">Thank you message</Label>
					<Textarea
						id="thankYouMessage"
						value={settings.thankYouMessage ?? ""}
						onChange={(e) =>
							onChange({
								settings: {
									...settings,
									thankYouMessage: e.target.value || undefined,
								},
							})
						}
						placeholder="Thank you for your response!"
						rows={2}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="redirectUrl">Redirect URL</Label>
					<Input
						id="redirectUrl"
						value={settings.redirectUrl ?? ""}
						onChange={(e) =>
							onChange({
								settings: {
									...settings,
									redirectUrl: e.target.value || undefined,
								},
							})
						}
						placeholder="https://example.com/thank-you"
					/>
				</div>
			</SettingsForm.Section>
		</div>
	);
}
