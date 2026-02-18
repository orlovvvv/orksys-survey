import { Mail } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

export function NewsletterSection() {
	return (
		<div className="space-y-3">
			<label
				htmlFor="newsletter"
				className="font-medium text-neutral-300 text-sm"
			>
				Subscribe to our newsletter
			</label>
			<div className="flex gap-2">
				<Input
					id="newsletter"
					type="email"
					placeholder="Enter your email"
					className="border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-500"
				/>
				<Button
					type="submit"
					size="icon"
					className="shrink-0 bg-primary hover:bg-primary/90"
				>
					<Mail className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
