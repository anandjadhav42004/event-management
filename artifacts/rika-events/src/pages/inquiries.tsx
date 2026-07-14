import React, { useState } from 'react';
import { useGetInquiries, useUpdateInquiry } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Calendar, DollarSign, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { getGetInquiriesQueryKey } from '@workspace/api-client-react';

const KANBAN_STAGES = [
  { id: 'new', label: 'New Lead' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'meeting_scheduled', label: 'Meeting' },
  { id: 'quotation_sent', label: 'Quoted' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'approved', label: 'Approved' }
];

export default function InquiriesPage() {
  const { data: inquiries, isLoading } = useGetInquiries();
  const updateInquiry = useUpdateInquiry();
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
      updateInquiry.mutate(
        { id: draggedId, data: { status } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetInquiriesQueryKey() });
          }
        }
      );
      setDraggedId(null);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-10rem)]">
      <div>
        <h1 className="text-3xl font-serif font-medium mb-1">Inquiries CRM</h1>
        <p className="text-muted-foreground">Track and convert leads into booked events.</p>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar pb-4">
        <div className="flex gap-4 h-full min-w-max">
          {isLoading ? (
            <div className="w-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            KANBAN_STAGES.map(stage => {
              const stageInquiries = inquiries?.filter(i => i.status === stage.id) || [];
              
              return (
                <div 
                  key={stage.id} 
                  className="w-80 flex flex-col bg-card/20 border border-white/5 rounded-xl overflow-hidden backdrop-blur-sm shrink-0"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  <div className="p-3 border-b border-white/5 bg-white/[0.02] flex justify-between items-center shrink-0">
                    <h3 className="font-medium text-sm tracking-wide uppercase">{stage.label}</h3>
                    <Badge variant="secondary" className="bg-white/10 text-xs font-mono">{stageInquiries.length}</Badge>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                    {stageInquiries.map(inquiry => (
                      <Card 
                        key={inquiry.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, inquiry.id)}
                        className={`bg-card/80 border-white/10 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors ${draggedId === inquiry.id ? 'opacity-50' : ''}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-foreground">{inquiry.clientName}</h4>
                            <Badge variant="outline" className="text-[9px] uppercase px-1.5 py-0 border-white/10 text-primary">
                              {inquiry.eventType}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 mt-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3" /> <span className="truncate">{inquiry.clientEmail}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" /> <span>{format(new Date(inquiry.eventDate), 'MMM d, yyyy')}</span>
                            </div>
                            {inquiry.budget && (
                              <div className="flex items-center gap-2 text-emerald-400/80">
                                <DollarSign className="w-3 h-3" /> <span>${inquiry.budget.toLocaleString()}</span>
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
