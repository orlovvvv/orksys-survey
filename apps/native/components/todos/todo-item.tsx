import { Ionicons } from "@expo/vector-icons";
import { Button, Checkbox, Surface, useThemeColor, View } from "heroui-native";
import { Alert, Text } from "react-native";

interface TodoItemProps {
	id: number;
	text: string;
	completed: boolean;
	onToggle: (id: number, completed: boolean) => void;
	onDelete: (id: number) => void;
}

export function TodoItem({
	id,
	text,
	completed,
	onToggle,
	onDelete,
}: TodoItemProps) {
	const dangerColor = useThemeColor("danger");

	const handleDelete = () => {
		Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: () => onDelete(id),
			},
		]);
	};

	return (
		<Surface variant="secondary" className="rounded-lg p-3">
			<View className="flex-row items-center gap-3">
				<Checkbox
					isSelected={completed}
					onSelectedChange={() => onToggle(id, completed)}
				/>
				<View className="flex-1">
					<Text
						className={`text-sm ${completed ? "text-muted line-through" : "text-foreground"}`}
					>
						{text}
					</Text>
				</View>
				<Button isIconOnly variant="ghost" onPress={handleDelete} size="sm">
					<Ionicons name="trash-outline" size={16} color={dangerColor} />
				</Button>
			</View>
		</Surface>
	);
}
