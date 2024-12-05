import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate: Date;
  description?: string;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (text: string, dueDate: Date, description?: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  editTodo: (id: string, text: string, dueDate: Date, description: string) => void;
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],
      addTodo: (text: string, dueDate: Date, description?: string) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: crypto.randomUUID(),
              text,
              completed: false,
              createdAt: new Date(),
              dueDate,
              description,
            },
          ],
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      removeTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      editTodo: (id, text, dueDate, description) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, text, dueDate, description }
              : todo
          ),
        })),
    }),
    {
      name: 'todo-storage',
    }
  )
);