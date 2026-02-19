import { Handshake } from "lucide-react";
import Link from "next/link";

export function AuthLogo() {
	return (
		<Link href="/" className="flex items-center gap-2 self-center font-medium">
			<div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
				<Handshake className="size-4" />
			</div>
			Handshake
		</Link>
	);
}
