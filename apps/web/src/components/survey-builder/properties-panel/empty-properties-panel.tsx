"use client";

import { Settings } from "lucide-react";

export function EmptyPropertiesPanel() {
	return (
		<div className="flex h-full w-72 flex-col border-border border-l bg-card">
			<div className="border-border border-b p-4">
				<div className="flex items-center justify-between">
					<h3 className="font-bold font-sans text-[10px] text-foreground uppercase tracking-widest">
						Settings
					</h3>
					<Settings className="h-4 w-4 text-muted-foreground" />
				</div>
			</div>
			<div className="flex flex-1 items-center justify-center p-4">
				<p className="text-center text-muted-foreground text-sm">
					Select a question to edit its properties
				</p>
			</div>
		</div>
	);
}
