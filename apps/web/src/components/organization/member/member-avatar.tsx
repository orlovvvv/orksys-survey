import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MemberAvatarProps {
	name: string;
	image?: string | null;
	size?: "sm" | "default";
}

export function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export function MemberAvatar({
	name,
	image,
	size = "default",
}: MemberAvatarProps) {
	return (
		<Avatar size={size}>
			{image ? <AvatarImage src={image} alt={name} /> : null}
			<AvatarFallback>{getInitials(name)}</AvatarFallback>
		</Avatar>
	);
}
