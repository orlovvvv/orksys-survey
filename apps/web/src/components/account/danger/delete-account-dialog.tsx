"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { FormField } from "@/components/forms/form-field";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export function DeleteAccountDialog() {
	const router = useRouter();
	const [open, setOpen] = React.useState(false);
	const [password, setPassword] = React.useState("");
	const [isDeleting, setIsDeleting] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const handleDelete = async () => {
		if (!password) {
			setError("Password is required");
			return;
		}

		setIsDeleting(true);
		setError(null);

		try {
			const result = await authClient.deleteUser({ password });

			if (result.error) {
				setError(result.error.message || "Failed to delete account");
				toast.error(result.error.message || "Failed to delete account");
				return;
			}

			toast.success("Account deleted successfully");
			setOpen(false);
			router.push("/");
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "An unexpected error occurred";
			setError(message);
			toast.error(message);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen && !isDeleting) {
			setOpen(false);
			setPassword("");
			setError(null);
		} else {
			setOpen(newOpen);
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={handleOpenChange}>
			<Card className="border-destructive/50 bg-destructive/5">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-destructive">
						<AlertTriangle className="h-5 w-5" />
						Danger Zone
					</CardTitle>
					<CardDescription>
						Permanently delete your account and all associated data
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground text-sm">
						This action cannot be undone. Please be certain.
					</p>
					<AlertDialogTrigger
						render={<Button variant="destructive">Delete Account</Button>}
					/>
				</CardContent>
			</Card>

			<AlertDialogContent size="default">
				<AlertDialogHeader>
					<AlertDialogMedia className="bg-destructive/10 text-destructive">
						<AlertTriangle className="h-5 w-5" />
					</AlertDialogMedia>
					<AlertDialogTitle>Delete Account</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete your account? All of your data will
						be permanently removed from our servers forever. This action cannot
						be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="space-y-4 py-4">
					<FormField
						id="delete-password"
						label="Password"
						type="password"
						value={password}
						onChange={setPassword}
						placeholder="Enter your password to confirm"
						error={error ?? undefined}
						required
					/>
				</div>

				<AlertDialogFooter>
					<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						onClick={(e) => {
							e.preventDefault();
							handleDelete();
						}}
						disabled={isDeleting || !password}
					>
						{isDeleting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Deleting...
							</>
						) : (
							"Yes, delete my account"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

// Alias for media slot
function AlertDialogMedia({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-dialog-media"
			className={`mb-2 inline-flex size-10 items-center justify-center rounded-md bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6 ${className ?? ""}`}
			{...props}
		/>
	);
}
