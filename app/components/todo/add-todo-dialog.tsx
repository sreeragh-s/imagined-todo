"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ResponsiveModal, ResponsiveModalTrigger, ResponsiveModalClose, ResponsiveModalPortal, ResponsiveModalOverlay, ResponsiveModalContent, ResponsiveModalHeader, ResponsiveModalTitle } from "@/components/ui/responsice-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, CalendarIcon } from "lucide-react";
import { useTodoStore } from "@/app/lib/zustand-store/todo-store";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface AddTodoDialogProps {
    selectedDate: Date;
}

export function AddTodoDialog({ selectedDate }: AddTodoDialogProps) {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [dueDate, setDueDate] = useState<Date>(selectedDate);
    const [description, setDescription] = useState("");
    const addTodo = useTodoStore((state) => state.addTodo);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    useEffect(() => {
        setDueDate(selectedDate);
    }, [selectedDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            addTodo(text.trim(), dueDate, description);
            setText("");
            setDueDate(selectedDate);
            setDescription("");
            setOpen(false);
        }
    };

    return (
        <ResponsiveModal open={open} onOpenChange={setOpen}>
            <ResponsiveModalTrigger asChild>
                <Button
                    size="icon"
                    className="h-14 w-14 rounded-full shadow-lg bg-white hover:bg-gray-100"
                >
                    <Plus className="h-6 w-6 text-gray-600" />
                </Button>
            </ResponsiveModalTrigger>
            <ResponsiveModalContent>
                <ResponsiveModalHeader>
                    <ResponsiveModalTitle className="text-sm font-semibold pb-2">Add New Todo</ResponsiveModalTitle>
                </ResponsiveModalHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="What needs to be done?"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                    />
                    <Textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Popover
                        open={isCalendarOpen}
                        onOpenChange={(open) => {
                            console.log("Popover open state changed:", open);
                            setIsCalendarOpen(open);
                        }}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !dueDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={dueDate}
                                onSelect={(date) => {
                                    setDueDate(date || new Date());
                                    setIsCalendarOpen(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>


                    <div className="flex justify-end">
                        <Button type="submit">Add Todo</Button>
                    </div>
                </form>
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
}