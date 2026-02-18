import { redirect } from "next/navigation";

export default function SettingsPage() {
	// Use as never to bypass typed routes until all settings routes exist
	redirect("/settings/profile" as never);
}
