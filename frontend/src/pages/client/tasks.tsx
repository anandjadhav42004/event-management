import React, { useState } from 'react';
import { useGetTasks } from "@/api";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function ClientTasksPage() {
  const { data: tasks, isLoading } = useGetTasks();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/20';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/20';
      case 'medium': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-medium mb-1">Planning Checklist</h1>
        <p className="text-muted-foreground">Your event milestones and required decisions.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-8">
          {/* Pending Tasks */}
          <div>
            <h2 className="text-xl font-serif mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" /> Action Required
            </h2>
            <div className="space-y-3">
              {tasks?.filter(t => t.status !== 'completed').length === 0 ? (
                <div className="text-muted-foreground italic bg-primary/5 p-6 rounded-xl border border-white/5 text-center">
                  You're all caught up! No pending tasks right now.
                </div>
              ) : (
                tasks?.filter(t => t.status !== 'completed').map(task => (
                  <Card key={task.id} className="bg-white/90 border-primary/10 backdrop-blur premium-shadow rounded-2xl hover:bg-primary/5 transition-colors">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex-shrink-0 mt-0.5"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-medium text-lg leading-tight">{task.title}</h3>
                          <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${getPriorityColor(task.priority)} shrink-0`}>
                            {task.priority}
                          </Badge>
                        </div>
                        {task.description && <p className="text-muted-foreground mt-2 text-sm">{task.description}</p>}
                        
                        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                          {task.dueDate && (
                            <div className={`flex items-center gap-1.5 ${new Date(task.dueDate) < new Date() ? 'text-red-400 font-medium' : ''}`}>
                              <CalendarIcon className="w-4 h-4" /> 
                              Due: {format(new Date(task.dueDate), 'MMMM do, yyyy')}
                            </div>
                          )}
                          <div className="px-2 py-1 rounded-sm bg-primary/5 uppercase tracking-wider">
                            Status: {task.status.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Completed Tasks */}
          <div>
            <h2 className="text-xl font-serif mb-4 flex items-center gap-2 opacity-70">
              <CheckCircle className="w-5 h-5 text-emerald-400" /> Completed
            </h2>
            <div className="space-y-3 opacity-70">
              {tasks?.filter(t => t.status === 'completed').map(task => (
                <Card key={task.id} className="bg-transparent border-white/5">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-muted-foreground line-through">{task.title}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
