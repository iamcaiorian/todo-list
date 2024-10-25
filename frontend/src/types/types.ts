export type Task = {
  id: string;
  description: string;
  is_done: boolean;
  todolist_id: string;
};
  
export type TodoList = {
  id: string;
  title: string;
  tasks: Task[];
};
