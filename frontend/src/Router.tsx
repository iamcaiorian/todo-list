import { createBrowserRouter } from 'react-router-dom';
import Home from "./pages/Home";
import TodoListPage from "./pages/TodoList";
import AppLayout from "./pages/AppLayout";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/todo/:id', element: <TodoListPage /> },
    ],
  },
]);

export default router;
