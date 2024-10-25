import { useEffect, useState } from "react";
import { Task, TodoList as TodoListType } from "../types/types";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { Checkbox } from "@mui/material";
import { FormControl, Select, MenuItem } from '@mui/material';
import { SelectChangeEvent } from "@mui/material";
import ModalCreateTask from "../components/ModalCreateTask";
import ModalDeleteConfirmation from "../components/ModalDeleteConfirmation";
import { getTodoListById, createTask, deleteTask, getTasks, updateTask, updateTaskDescription } from "../services/api";
import { useParams } from "react-router-dom";

const TodoListPage: React.FC = () => {
 const { id } = useParams<{ id: string }>();
 const [list, setList] = useState<TodoListType | null>(null); 
 const [openModal, setOpenModal] = useState(false);
 const [openDeleteModal, setOpenDeleteModal] = useState(false);
 const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);
 const [isEditModeId, setIsEditModeId] = useState<string | null>(null);
 const [newDescription, setNewDescription] = useState<string>("");
 const [filter, setFilter] = useState('all');

// Buscar TodoList e suas tarefas
useEffect(() => {
  const fetchTodoList = async () => {
    if (id) {
      try {
        setLoading(true);
        const response = await getTodoListById(id);
        setList(response.data);
      } catch (error) {
        console.error("Erro ao buscar todo list:", error);
      } finally {
        setLoading(false); 
      }
    }
  };
  
  const fetchTasks = async () => {
    if (id) {
      try {
        setLoading(true);
        const response = await getTasks(id);
        const tasks = await response.data.map((task: Task) => ({
          id: task.id,
          description: task.description,
          is_done: task.is_done,
        }));
        setList((prev) => prev ? { ...prev, tasks } : null);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  
  fetchTodoList();
  fetchTasks();
}, [id]);

 const handleOpenModal = () => setOpenModal(true);
 const handleCloseModal = () => setOpenModal(false);

 const handleOpenDeleteModal = (taskId: string) => {
   setTaskToDelete(taskId);
   setOpenDeleteModal(true);
 };
 const handleCloseDeleteModal = () => {
   setTaskToDelete(null);
   setOpenDeleteModal(false);
 };

 // Adicionar uma nova tarefa
 const handleAddTask = async (description: string) => {
   if (id) {
     try {
       const response = await createTask(id, description);
       setList((prev) => prev && { ...prev, tasks: [response.data, ...prev.tasks] });
     } catch (error) {
       console.error("Erro ao criar tarefa:", error);
     }
   }
   handleCloseModal();
 };

 // Deletar uma tarefa
 const handleDeleteTask = async () => {
   if (!taskToDelete || !id) return;
   try {
     await deleteTask(id, taskToDelete);
     setList((prev) =>
       prev ? { ...prev, tasks: prev.tasks.filter((task) => task.id !== taskToDelete) } : prev
     );
   } catch (error) {
     console.error("Erro ao deletar tarefa:", error);
   }
   handleCloseDeleteModal();
 };

 // Alterar o estado de uma tarefa, se está feita ou não
 const handleToggleTask = async (taskId: string) => {
    if (!id) return;
    try {
      const task = list?.tasks.find((task) => task.id === taskId);
      await updateTask(id, taskId, !task?.is_done);
      setList((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((task) =>
                task.id === taskId ? { ...task, is_done: !task.is_done } : task
              ),
            }
          : prev
      );
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
};

// Alterar o título da task
const handleEditTask = async ( event: React.KeyboardEvent<HTMLInputElement> ,taskId: string, description: string) => {
  if(event.key === 'Enter' && id) {
    try {
      await updateTaskDescription(id, taskId, description);
      setList((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((task) =>
                task.id === taskId ? { ...task, description: description } : task
              ),
            }
          : prev
      );
      setIsEditModeId(null);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  }
};

const handleDoubleClick = (taskId: string) => {
  setIsEditModeId(taskId);
  setNewDescription(list?.tasks.find((task) => task.id === taskId)?.description || "");
}

const handleBlur = () => {
  setIsEditModeId(null);
  setNewDescription("");
}

const handleFilterChange = (event: SelectChangeEvent<string>) => {
  setFilter(event.target.value as string); 
};

const filteredTasks = list?.tasks?.filter((task) => {
  if (filter === 'done') return task.is_done;
  if (filter === 'not_done') return !task.is_done;
  return true;
}) || [];

useEffect(() => {
  console.log(list?.tasks); // Isso será executado toda vez que list.tasks mudar
}, [list?.tasks]);

 return (
    <div className="bg-zinc-900 text-zinc-50 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex items-center justify-between w-full max-w-2xl">
          <div className="flex items-center">
            {/* botão para voltar para home */}
            <button
              onClick={() => window.history.back()}
              className="text-zinc-50 hover:underline"
            >
              <ArrowBackIosRoundedIcon />
            </button>

            <h1 className="text-3xl font-bold ml-2">{list?.title}</h1>

            <span
              className="text-sm font-semibold text-zinc-50 py-2 px-4 ml-4 bg-zinc-800 rounded-full"
            >
              {list?.tasks?.filter((task) => task.is_done).length || 0}/{list?.tasks?.length || 0}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <FormControl variant="outlined" size="small">
              <Select
                labelId="filter-select-label"
                id="filter-select"
                value={filter}
                onChange={handleFilterChange}
                sx={{
                  color: '#FAFAFA', 
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#71717A',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0284C7',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0284C7',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#FAFAFA', 
                  },
                }}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="done">Feitas</MenuItem>
                <MenuItem value="not_done">Não Feitas</MenuItem>
              </Select>
            </FormControl>

            
            <button
              onClick={handleOpenModal}
              className="bg-sky-600 px-4 py-2 rounded-md flex items-center gap-1 hover:bg-sky-700 transition font-semibold"
            >
              Tarefa <AddIcon />
            </button>
          </div>

          <ModalCreateTask open={openModal} onClose={handleCloseModal} onAdd={handleAddTask} />
        </div>

        {/* Verificação de carregamento */}
        {loading ? (
          <p className="text-center">Carregando tarefas...</p>
        ) : list?.tasks && list?.tasks.length > 0 ? (
          <div className="space-y-2 mt-8">
            {filteredTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between bg-zinc-800 p-4 rounded-md shadow-md">
                <Checkbox 
                  checked={task.is_done}
                  onChange={() => handleToggleTask(task.id)}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      color: '#FAFAFA', // Cor padrão da borda
                    },
                    '&:hover .MuiSvgIcon-root': {
                      color: '#0284C7', // Cor da borda ao passar o mouse
                    },
                    '&.Mui-checked .MuiSvgIcon-root': {
                      color: '#0284C7', // Cor da borda quando o checkbox está marcado
                    },
                  }} 
                />

                {
                  task.id === isEditModeId  ? (
                    <input 
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      onKeyDown={(e) => handleEditTask(e, task.id, e.currentTarget.value)}
                      onBlur={() => handleBlur()}
                      className="flex-1 bg-zinc-800 text-zinc-50  rounded-md outline-none"
                    />
                  ) : (
                    <p 
                      onClick={() => handleDoubleClick(task.id)}
                      className="flex-1"
                    >
                      {task.description}
                    </p>
                  )
                }
                
                <button onClick={() => handleOpenDeleteModal(task.id)} className="ml-4 text-zinc-600 hover:text-zinc-300 transition">
                  <DeleteIcon />
                </button>
              </div>
            ))}
            <ModalDeleteConfirmation open={openDeleteModal} onClose={handleCloseDeleteModal} onConfirm={handleDeleteTask} />
          </div>
        ) : (
          <p className="text-center mt-8">Nenhuma tarefa encontrada. Adicione uma nova tarefa.</p>
        )}

      </div>
    </div>
 );
};

export default TodoListPage;
