import type { QuestionConfig } from "@orksys-survey/db";

import { LinearScaleEditor } from "./rating/linear-scale-editor";
import { NPSEditor } from "./rating/nps-editor";
import { RatingScaleEditor } from "./rating/rating-scale-editor";

interface RatingEditorProps {
	config: QuestionConfig;
	onChange: (config: QuestionConfig) => void;
	type: "rating" | "nps" | "linear_scale";
}

export function RatingEditor({ config, onChange, type }: RatingEditorProps) {
	if (type === "nps") {
		return <NPSEditor config={config} onChange={onChange} />;
	}

	if (type === "linear_scale") {
		return <LinearScaleEditor config={config} onChange={onChange} />;
	}

	return <RatingScaleEditor config={config} onChange={onChange} />;
}
