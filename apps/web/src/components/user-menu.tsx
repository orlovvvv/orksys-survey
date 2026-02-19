"use client";

import { Building2, CreditCard, LogOut, Shield, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";

function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/);
	if (parts.length === 1) {
		return parts[0].charAt(0).toUpperCase();
	}
	return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function UserMenu() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return <Skeleton className="size-8 rounded-full" />;
	}

	if (!session) {
		return (
			<Button
				variant="outline"
				nativeButton={false}
				render={<Link href="/login" />}
			>
				Sign In
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button variant="ghost" className="h-8 w-8 rounded-full p-0">
						<Avatar className="h-9 w-9">
							<AvatarImage
								src={session.user.image ?? undefined}
								alt={session.user.name ?? "User"}
							/>
							<AvatarFallback>
								{session.user.name ? getInitials(session.user.name) : "?"}
							</AvatarFallback>
						</Avatar>
					</Button>
				}
			/>
			<DropdownMenuContent align="end" className="w-56">
				<div className="px-1.5 py-1.5">
					<p className="truncate font-medium text-sm">{session.user.name}</p>
					<p className="truncate text-muted-foreground text-xs">
						{session.user.email}
					</p>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem render={<Link href="/settings/profile" />}>
						<User className="mr-2 size-4" />
						Profile
					</DropdownMenuItem>
					<DropdownMenuItem render={<Link href="/settings/organization" />}>
						<Building2 className="mr-2 size-4" />
						Organization
					</DropdownMenuItem>
					<DropdownMenuItem render={<Link href="/settings/subscription" />}>
						<CreditCard className="mr-2 size-4" />
						Subscription
					</DropdownMenuItem>
					<DropdownMenuItem render={<Link href="/settings/security" />}>
						<Shield className="mr-2 size-4" />
						Security
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						authClient.signOut({
							fetchOptions: {
								onSuccess: () => {
									router.push("/");
								},
							},
						});
					}}
				>
					<LogOut className="mr-2 size-4" />
					Sign Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
