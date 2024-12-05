"use client";

import { useState } from "react";
import { TodoItem } from "./todo-item";
import { AddTodoDialog } from "./add-todo-dialog";
import { useTodoStore } from "@/app/lib/zustand-store/todo-store";
import { isSameDay, format } from "date-fns";
import { WeekCalendar } from "./week-calendar";

export function TodoList() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { todos, toggleTodo, removeTodo, editTodo } = useTodoStore();

  const filteredTodos = todos.filter((todo) => 
    isSameDay(new Date(todo.dueDate), selectedDate)
  );

  return (
    <div className="w-screen h-screen bg-muted/50 max-w-md mx-auto">
      <div >
        <WeekCalendar 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
        <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">
            {isSameDay(selectedDate, new Date()) 
              ? "Today" 
              : format(selectedDate, 'MMMM d, yyyy')}
          </h2>
          <div className="space-y-4">
            {filteredTodos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No todos for this date. Add one to get started!
              </p>
            ) : (
              filteredTodos
                .sort((a, b) => {
                  const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
                  const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
                  return bTime - aTime;
                })
                .map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onRemove={removeTodo}
                    onEdit={editTodo}
                  />
                ))
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <AddTodoDialog selectedDate={selectedDate} />
      </div>
    </div>
  );
}