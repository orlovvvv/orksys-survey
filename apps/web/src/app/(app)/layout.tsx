import { AppHeader } from "@/components/app-header";

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="grid h-svh grid-rows-[auto_1fr]">
			<AppHeader />
			{children}
		</div>
	);
}
