import { useMutation, useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

export function useTodosMutations() {
	const todos = useQuery(orpc.todo.getAll.queryOptions());

	const createMutation = useMutation(
		orpc.todo.create.mutationOptions({
			onSuccess: () => {
				todos.refetch();
			},
		}),
	);

	const toggleMutation = useMutation(
		orpc.todo.toggle.mutationOptions({
			onSuccess: () => {
				todos.refetch();
			},
		}),
	);

	const deleteMutation = useMutation(
		orpc.todo.delete.mutationOptions({
			onSuccess: () => {
				todos.refetch();
			},
		}),
	);

	return {
		todos,
		createMutation,
		toggleMutation,
		deleteMutation,
	};
}
