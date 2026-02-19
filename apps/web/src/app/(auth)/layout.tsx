import { Logo } from "@/components/brand";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6 md:max-w-4xl">
				<Logo className="self-center" />
				{children}
			</div>
		</div>
	);
}
