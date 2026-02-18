import { Ionicons } from "@expo/vector-icons";
import {
	Button,
	Input,
	Spinner,
	Surface,
	TextField,
	useThemeColor,
	View,
} from "heroui-native";

interface AddTodoFormProps {
	newTodoText: string;
	onTextChange: (text: string) => void;
	onAdd: () => void;
	isPending: boolean;
}

export function AddTodoForm({
	newTodoText,
	onTextChange,
	onAdd,
	isPending,
}: AddTodoFormProps) {
	const mutedColor = useThemeColor("muted");
	const foregroundColor = useThemeColor("foreground");

	return (
		<Surface variant="secondary" className="mb-4 rounded-lg p-3">
			<View className="flex-row items-center gap-2">
				<View className="flex-1">
					<TextField>
						<Input
							value={newTodoText}
							onChangeText={onTextChange}
							placeholder="Add a new task..."
							editable={!isPending}
							onSubmitEditing={onAdd}
							returnKeyType="done"
						/>
					</TextField>
				</View>
				<Button
					isIconOnly
					variant={isPending || !newTodoText.trim() ? "secondary" : "primary"}
					isDisabled={isPending || !newTodoText.trim()}
					onPress={onAdd}
					size="sm"
				>
					{isPending ? (
						<Spinner size="sm" color="default" />
					) : (
						<Ionicons
							name="add"
							size={20}
							color={
								isPending || !newTodoText.trim() ? mutedColor : foregroundColor
							}
						/>
					)}
				</Button>
			</View>
		</Surface>
	);
}
