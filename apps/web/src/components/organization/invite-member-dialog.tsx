"use client";

import { useForm } from "@tanstack/react-form";
import * as React from "react";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client";

interface InviteMemberDialogProps {
	onSuccess?: () => void;
	trigger?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function InviteMemberDialog({
	onSuccess,
	trigger,
	open: controlledOpen,
	onOpenChange,
}: InviteMemberDialogProps) {
	const isMobile = useIsMobile();
	const [internalOpen, setInternalOpen] = React.useState(false);

	const open = controlledOpen ?? internalOpen;
	const setOpen = onOpenChange ?? setInternalOpen;

	const form = useForm({
		defaultValues: {
			email: "",
			role: "member" as "member" | "admin",
		},
		onSubmit: async ({ value }) => {
			const result = await authClient.organization.inviteMember({
				email: value.email,
				role: value.role,
			});

			if (result.error) {
				toast.error(result.error.message || "Failed to send invitation");
				return;
			}

			toast.success("Invitation sent successfully");
			onSuccess?.();
			setOpen(false);
			form.reset();
		},
		validators: {
			onSubmit: z.object({
				email: z.string().email("Invalid email address"),
				role: z.enum(["member", "admin"]),
			}),
		},
	});

	const content = (
		<>
			{isMobile ? (
				<SheetHeader>
					<SheetTitle>Invite Member</SheetTitle>
				</SheetHeader>
			) : (
				<DialogHeader>
					<DialogTitle>Invite Member</DialogTitle>
					<DialogDescription>
						Send an invitation to join your organization
					</DialogDescription>
				</DialogHeader>
			)}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<form.Field name="email">
					{(field) => (
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
								placeholder="colleague@example.com"
								className={
									field.state.meta.errors[0]?.message
										? "border-destructive"
										: ""
								}
							/>
							{field.state.meta.errors[0]?.message && (
								<p className="text-destructive text-sm">
									{field.state.meta.errors[0]?.message}
								</p>
							)}
						</div>
					)}
				</form.Field>

				<form.Field name="role">
					{(field) => (
						<div className="space-y-2">
							<Label htmlFor="role">Role</Label>
							<Select
								value={field.state.value}
								onValueChange={(value) =>
									field.handleChange(value as "member" | "admin")
								}
							>
								<SelectTrigger id="role">
									<SelectValue placeholder="Select a role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="member">Member</SelectItem>
									<SelectItem value="admin">Admin</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}
				</form.Field>

				<form.Subscribe>
					{(state) => (
						<Button
							type="submit"
							className="w-full"
							disabled={!state.canSubmit || state.isSubmitting}
						>
							{state.isSubmitting ? "Sending..." : "Send Invitation"}
						</Button>
					)}
				</form.Subscribe>
			</form>
		</>
	);

	if (isMobile) {
		return (
			<Sheet open={open} onOpenChange={setOpen}>
				{trigger ? (
					<SheetTrigger render={trigger as React.ReactElement} />
				) : null}
				<SheetContent
					side="bottom"
					className="max-h-[90vh] overflow-y-auto rounded-t-xl"
				>
					{content}
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{trigger ? (
				<DialogTrigger render={trigger as React.ReactElement} />
			) : null}
			<DialogContent>{content}</DialogContent>
		</Dialog>
	);
}
