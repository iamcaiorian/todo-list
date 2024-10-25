// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Altere para a URL correta da sua API
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Authorization", 
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE" ,
    "Content-Type": "application/json;charset=UTF-8"    
  },
});

export const getTodoLists = () => {
  return api.get("/todolists");
};

export const getTodoListById = (id: string) => {
  return api.get(`/todolists/${id}`);
};

export const createTodoList = (title: string) => {
  return api.post("/todolists", { title: title });
};

export const updateTodoList = (id: string, title: string) => {
  return api.put(`/todolists/${id}`, { title });
}

export const deleteTodoList = (id: string) => {
  return api.delete(`/todolists/${id}`);
};

export const getTasks = (todoListId: string) => {
  return api.get(`/todolists/${todoListId}/tasks`);
}

export const createTask = (todoListId: string, description: string) => {
  return api.post(`/tasks`, { description, todolist_id: todoListId });
};

export const deleteTask = (todoListId: string, taskId: string) => {
  return api.delete(`/todolists/${todoListId}/tasks/${taskId}`);
};

export const updateTask = (todoListId: string, taskId: string, is_done: boolean) => {
  return api.put(`/todolists/${todoListId}/tasks/${taskId}`, { is_done });
};

export const updateTaskDescription = (todoListId: string, taskId: string, description: string) => {
  return api.put(`/todolists/${todoListId}/tasks/${taskId}`, { description });
}

export const getAllTasks = () => {
  return api.get("/tasks");
}
