import { Mail } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

export function NewsletterSection() {
	return (
		<div className="space-y-3">
			<label htmlFor="newsletter" className="font-medium text-sm text-zinc-200">
				Subscribe to our newsletter
			</label>
			<div className="flex gap-2">
				<Input
					id="newsletter"
					type="email"
					placeholder="Enter your email"
					className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400"
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
