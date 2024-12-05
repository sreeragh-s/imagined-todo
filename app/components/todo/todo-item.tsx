"use client";

import { useState } from "react";
import { Todo } from "@/app/lib/zustand-store/todo-store";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, text: string, dueDate: Date, description: string) => void;
}

export function TodoItem({ todo, onToggle, onRemove, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);
  const [editedDescription, setEditedDescription] = useState(todo.description || "");
  const [editedDueDate, setEditedDueDate] = useState<Date>(todo.dueDate);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedText.trim()) {
      onEdit(todo.id, editedText.trim(), editedDueDate, editedDescription);
      setIsEditing(false);
    }
  };

  return (
    <>
      <div className="flex items-start gap-3 group relative bg-background rounded-lg p-4 items-center">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          className="mt-1.5 h-5 w-5 rounded-full border-2 data-[state=checked]:bg-black data-[state=checked]:border-black"
        />
        <div>
          <h3 className="font-semibold text-base">{todo.text}</h3>
          {todo.description && (
            <p className="text-sm text-gray-600">{todo.description}</p>
          )}
        </div>
        <div className="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 px-4">
          <button
            onClick={() => setIsEditing(true)}
            className="hover:text-blue-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onRemove(todo.id)}
            className="hover:text-red-600"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="What needs to be done?"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              autoFocus
            />
            <Input
              placeholder="Description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
            <Popover
              open={isCalendarOpen}
              onOpenChange={setIsCalendarOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !editedDueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedDueDate ? format(editedDueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={editedDueDate}
                  onSelect={(date) => {
                    setEditedDueDate(date || new Date());
                    setIsCalendarOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}