import { PanelLeftClose, PanelRightClose } from "lucide-react";

import { Button } from "@/components/ui/button";

interface MobileToggleButtonProps {
	side: "left" | "right";
	onClick: () => void;
}

export function MobileToggleButton({ side, onClick }: MobileToggleButtonProps) {
	const Icon = side === "left" ? PanelLeftClose : PanelRightClose;

	return (
		<Button variant="ghost" size="icon" onClick={onClick}>
			<Icon className="h-4 w-4" />
		</Button>
	);
}
