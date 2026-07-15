import React, { useState } from 'react';
import { useGetTasks, useUpdateTask } from '@/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar as CalendarIcon, User } from 'lucide-react';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { getGetTasksQueryKey } from '@/api';

const KANBAN_STAGES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'Under Review' },
  { id: 'completed', label: 'Completed' }
];

export default function TasksPage() {
  const { data: tasks, isLoading } = useGetTasks();
  const updateTask = useUpdateTask();
  const queryClient = useQueryClient();

  const [draggedId, setDraggedId] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (draggedId) {
      updateTask.mutate(
        { id: draggedId, data: { status } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetTasksQueryKey() });
          }
        }
      );
      setDraggedId(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/20';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/20';
      case 'medium': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-10rem)]">
      <div>
        <h1 className="text-3xl font-serif font-medium mb-1">Task Orchestration</h1>
        <p className="text-muted-foreground">Manage operational tasks across all events.</p>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar pb-4">
        <div className="flex gap-4 h-full min-w-max">
          {isLoading ? (
            <div className="w-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            KANBAN_STAGES.map(stage => {
              const stageTasks = tasks?.filter(t => t.status === stage.id) || [];
              
              return (
                <div 
                  key={stage.id} 
                  className="w-80 flex flex-col bg-card/20 border border-white/5 rounded-xl overflow-hidden backdrop-blur-sm shrink-0"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  <div className="p-3 border-b border-white/5 bg-white/[0.02] flex justify-between items-center shrink-0">
                    <h3 className="font-medium text-sm tracking-wide uppercase">{stage.label}</h3>
                    <Badge variant="secondary" className="bg-white/10 text-xs font-mono">{stageTasks.length}</Badge>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                    {stageTasks.map(task => (
                      <Card 
                        key={task.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className={`bg-card/80 border-white/10 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors ${draggedId === task.id ? 'opacity-50' : ''}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h4 className="font-medium text-sm leading-tight text-foreground">{task.title}</h4>
                            <Badge variant="outline" className={`text-[9px] uppercase px-1.5 py-0 shrink-0 ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </Badge>
                          </div>
                          
                          {task.eventTitle && (
                            <div className="text-xs text-primary/80 mb-3 truncate font-medium">
                              {task.eventTitle}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground border-t border-white/5 pt-2">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3 h-3" /> <span className="truncate max-w-[100px]">{task.assigneeName || 'Unassigned'}</span>
                            </div>
                            {task.dueDate && (
                              <div className={`flex items-center gap-1.5 ${new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-400' : ''}`}>
                                <CalendarIcon className="w-3 h-3" /> <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
