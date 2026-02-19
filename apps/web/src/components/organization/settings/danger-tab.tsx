"use client";

import { DeleteOrgDialog } from "@/components/organization/member/delete-org-dialog";

export interface DangerTabProps {
	organizationId: string;
	organizationName: string;
	memberCount: number;
	isDeleting?: boolean;
	onDelete: () => void;
}

export function DangerTab({
	organizationName,
	memberCount,
	isDeleting = false,
	onDelete,
}: DangerTabProps) {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="font-semibold text-lg">Danger Zone</h2>
				<p className="text-muted-foreground text-sm">
					Irreversible and destructive actions
				</p>
			</div>

			<DeleteOrgDialog
				organizationName={organizationName}
				memberCount={memberCount}
				isDeleting={isDeleting}
				onDelete={onDelete}
			/>
		</div>
	);
}
