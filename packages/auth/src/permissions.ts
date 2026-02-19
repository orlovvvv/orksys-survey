import { createAccessControl } from "better-auth/plugins";

// Define role definitions
const statement = {
	organization: ["create", "read", "update", "delete"],
	survey: ["create", "read", "update", "delete", "publish"],
	response: ["read", "delete", "export"],
	member: ["create", "update", "delete"],
	invitation: ["create", "cancel"],
	billing: ["manage"],
} as const;

// Create access control instance
export const ac = createAccessControl(statement);

// Define roles with their permissions
export const member = ac.newRole({
	organization: ["read"],
	survey: ["create", "read", "update"],
	response: ["read", "export"],
});

export const admin = ac.newRole({
	organization: ["read", "update"],
	survey: ["create", "read", "update", "delete", "publish"],
	response: ["read", "delete", "export"],
	member: ["create", "update", "delete"],
	invitation: ["create", "cancel"],
});

export const owner = ac.newRole({
	organization: ["create", "read", "update", "delete"],
	survey: ["create", "read", "update", "delete", "publish"],
	response: ["read", "delete", "export"],
	member: ["create", "update", "delete"],
	invitation: ["create", "cancel"],
	billing: ["manage"],
});
