import { Ionicons } from "@expo/vector-icons";
import { Chip, Spinner, Surface, useThemeColor } from "heroui-native";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Container } from "@/components/container";
import { AddTodoForm } from "./add-todo-form";
import { useTodosMutations } from "./hooks/use-todos-mutations";
import { TodoItem } from "./todo-item";

export default function TodosScreen() {
	const [newTodoText, setNewTodoText] = useState("");
	const { todos, createMutation, toggleMutation, deleteMutation } =
		useTodosMutations();

	const mutedColor = useThemeColor("muted");

	const handleAddTodo = () => {
		if (newTodoText.trim()) {
			createMutation.mutate(
				{ text: newTodoText },
				{
					onSuccess: () => {
						setNewTodoText("");
					},
				},
			);
		}
	};

	const handleToggleTodo = (id: number, completed: boolean) => {
		toggleMutation.mutate({ id, completed: !completed });
	};

	const handleDeleteTodo = (id: number) => {
		deleteMutation.mutate({ id });
	};

	const isLoading = todos?.isLoading;
	const completedCount = todos?.data?.filter((t) => t.completed).length || 0;
	const totalCount = todos?.data?.length || 0;

	return (
		<Container>
			<ScrollView className="flex-1" contentContainerClassName="p-4">
				<View className="mb-4 py-4">
					<View className="flex-row items-center justify-between">
						<Text className="font-semibold text-2xl text-foreground tracking-tight">
							Tasks
						</Text>
						{totalCount > 0 && (
							<Chip variant="secondary" color="accent" size="sm">
								<Chip.Label>
									{completedCount}/{totalCount}
								</Chip.Label>
							</Chip>
						)}
					</View>
				</View>

				<AddTodoForm
					newTodoText={newTodoText}
					onTextChange={setNewTodoText}
					onAdd={handleAddTodo}
					isPending={createMutation.isPending}
				/>

				{isLoading && (
					<View className="items-center justify-center py-12">
						<Spinner size="lg" />
						<Text className="mt-3 text-muted text-sm">Loading tasks...</Text>
					</View>
				)}

				{todos?.data && todos.data.length === 0 && !isLoading && (
					<Surface
						variant="secondary"
						className="items-center justify-center rounded-lg py-10"
					>
						<Ionicons name="checkbox-outline" size={40} color={mutedColor} />
						<Text className="mt-3 font-medium text-foreground">
							No tasks yet
						</Text>
						<Text className="mt-1 text-muted text-xs">
							Add your first task to get started
						</Text>
					</Surface>
				)}

				{todos?.data && todos.data.length > 0 && (
					<View className="gap-2">
						{todos.data.map((todo) => (
							<TodoItem
								key={todo.id}
								id={todo.id}
								text={todo.text}
								completed={todo.completed}
								onToggle={handleToggleTodo}
								onDelete={handleDeleteTodo}
							/>
						))}
					</View>
				)}
			</ScrollView>
		</Container>
	);
}
