export type MemberRole = "owner" | "admin" | "member";
export type InvitationStatus = "pending" | "accepted" | "rejected" | "canceled";

export interface Member {
	id: string;
	userId: string;
	user: { id: string; name: string; email: string; image?: string | null };
	role: MemberRole;
	createdAt: Date;
}

export interface Invitation {
	id: string;
	email: string;
	role: MemberRole;
	status: InvitationStatus;
	expiresAt: Date;
	createdAt: Date;
}

export interface ReceivedInvitation {
	id: string;
	email: string;
	role: MemberRole;
	status: InvitationStatus;
	expiresAt: Date;
	createdAt: Date;
	organizationId: string;
	organizationName: string;
	organizationSlug?: string;
	inviter?: { email: string };
}
