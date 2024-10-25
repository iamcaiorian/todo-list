import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalCreateTodoList from "../components/ModalCreateTodoList";
import ModalDeleteConfirmation from "../components/ModalDeleteConfirmation";
import { Task, TodoList } from "../types/types";
import { getTodoLists, createTodoList, deleteTodoList, getAllTasks, updateTodoList } from "../services/api";
import EditIcon from '@mui/icons-material/Edit';

const Home: React.FC = () => {
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>("");
  const [filteredTodoLists, setFilteredTodoLists] = useState<TodoList[]>([]);
  const [isEditModeId, setIsEditModeId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");

  // Buscar todas as listas de todos na API
  useEffect(() => {
    const fetchTodoLists = async () => {
      try {
        const response = await getTodoLists();
        setTodoLists(response.data);
      } catch (error) {
        console.error("Erro ao buscar todo lists:", error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await getAllTasks();
        setTasks(response.data);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      }
    }

    fetchTasks();
    fetchTodoLists();
  }, []);


  // Calcular progresso de tarefas
  const calculateProgress = (listId: string) => {
    const totalTasks = tasks.filter((task) => task.todolist_id === listId).length;
    const completedTasks = tasks.filter((task) => task.todolist_id === listId && task.is_done).length;
    return `${completedTasks}/${totalTasks}`;
  }

  useEffect(() => {
    const filtered = todoLists.filter((list) =>
      list.title.toLowerCase().includes(title.toLowerCase()) // Filtro insensível a maiúsculas/minúsculas
    );
    setFilteredTodoLists(filtered); // Atualizar a lista filtrada
  }, [title, todoLists]); // Refazer o filtro sempre que o título ou a lista original mudar


  // Abrir/Fechar Modal de Criação
  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => setOpenCreateModal(false);

  // Abrir/Fechar Modal de Exclusão
  const handleOpenDeleteModal = (id: string) => {
    setSelectedListId(id);
    setOpenDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setSelectedListId(null);
    setOpenDeleteModal(false);
  };

  // Criar uma nova Todo List
  const handleCreateTodoList = async (name: string) => {
    try {
      const response = await createTodoList(name);
      setTodoLists((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Erro ao criar todo list:", error);
    }
    handleCloseCreateModal();
  };

  // Excluir uma Todo List
  const handleDelete = async () => {
    if (selectedListId) {
      try {
        await deleteTodoList(selectedListId);
        setTodoLists((prev) => prev.filter((list) => list.id !== selectedListId));
      } catch (error) {
        console.error("Erro ao deletar todo list:", error);
      }
      handleCloseDeleteModal();
    }
  };

  // Editar o título de uma Todo List
  const handleEditTitle = (listId: string) => {
    setIsEditModeId(listId);
    setNewTitle(todoLists.find((list) => list.id === listId)?.title || "");
  };

  // Salvar a edição do título de uma Todo List
  const handleEditTodo = async (event: React.KeyboardEvent<HTMLInputElement>, listId: string, title: string) => {
    if (event.key === 'Enter') {
      try {
        await updateTodoList(listId, title);
        setTodoLists((prev) => prev.map((list) => list.id === listId ? { ...list, title } : list));
      } catch (error) {
        console.error("Erro ao editar todo list:", error);
      }
      setIsEditModeId(null);
    }
  };

  // Cancelar a edição do título de uma Todo List
  const handleBlur = () => {
    setIsEditModeId(null);
  };

  return (
    <div className="bg-zinc-900 text-zinc-50 flex flex-col items-center">
      {/* Barra de Pesquisa e Botão */}
      <div className="flex items-center justify-between w-full max-w-2xl">
        <input
          type="text"
          placeholder='Pesquisar por um "to do"'
          value={title} // Conecta o input ao estado "title"
          onChange={(e) => setTitle(e.target.value)} // Atualiza o estado "title"
          className="bg-zinc-800 text-zinc-50 px-4 py-2 rounded-md w-80 outline-none"
        />
        <button
          onClick={handleOpenCreateModal}
          className="bg-sky-600 px-4 py-2 rounded-md flex items-center gap-1 hover:bg-sky-700 transition font-semibold"
        >
          to do <AddIcon className="text-zinc-50" />
        </button>

        {/* Modal para criar TodoList */}
        <ModalCreateTodoList
          open={openCreateModal}
          onClose={handleCloseCreateModal}
          onCreate={handleCreateTodoList}
        />
      </div>

      {/* Lista de Tarefas */}
      <div className="w-full max-w-2xl space-y-4 mt-8">
        {filteredTodoLists.length > 0 ? ( // Verifica se há resultados após o filtro
          filteredTodoLists.map((list) => (
            <div
              key={list.id}
              className="flex items-center justify-between bg-zinc-800 p-4 hover:bg-zinc-700 rounded-md shadow-md"
            >
              {/* Progresso de Tarefas */}
              <span className="text-sm text-zinc-400">
                {calculateProgress(list.id)}
              </span>

              {/* Nome da Lista */}
              {
                  list.id === isEditModeId  ? (
                    <input 
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => handleEditTodo(e, list.id, e.currentTarget.value)}
                      onBlur={() => handleBlur()}
                      className="flex-1 bg-zinc-800 text-zinc-50 rounded-md outline-none text-lg font-semibold  mx-4 transition-all duration-300 ease-in-out"
                      style={{
                        paddingLeft: '12px'
                      }}
                    />
                  ) : (
                    <Link to={`/todo/${list.id}`} className="flex-1 ml-4">
                      <h2 className="text-xl font-semibold">{list.title}</h2>
                    </Link>
                  )
                }

              <div className="flex items-center">
                {/* Botão de Editar */}
                <button
                  onClick={() => handleEditTitle(list.id)}
                  className="text-zinc-600 hover:text-zinc-300 transition"
                >
                  <EditIcon />
                </button>
              
                {/* Botão de Excluir */}
                <button
                  onClick={() => handleOpenDeleteModal(list.id)}
                  className="ml-4 text-zinc-600 hover:text-zinc-300 transition"
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-zinc-400">Nenhum to do encontrado</p> // Mensagem se o filtro não encontrar nada
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <ModalDeleteConfirmation
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Home;
