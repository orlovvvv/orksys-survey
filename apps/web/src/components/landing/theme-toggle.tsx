"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className={cn(
				"flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-900 shadow-xl backdrop-blur-md transition-colors hover:bg-zinc-800",
				className,
			)}
			aria-label="Toggle theme"
		>
			<Sun className="h-4 w-4 rotate-0 scale-100 text-zinc-300 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute h-4 w-4 rotate-90 scale-0 text-zinc-300 transition-all dark:rotate-0 dark:scale-100" />
		</button>
	);
}
