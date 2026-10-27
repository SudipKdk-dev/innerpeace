import { useState } from 'react';
import { SectionHeading } from '@/components/SectionHeading';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format';
import { useAuth } from '@/hooks/useAuth';
import { MessageCircle, Mail, Inbox, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/toast';

interface AnonymousMessage {
    id: number;
    message: string;
    ipAddress: string | null;
    isRead: boolean;
    createdAt: string;
}

interface MessagesResponse {
    messages: AnonymousMessage[];
    unreadCount: number;
}

export default function AdminMessages() {
    const { token } = useAuth();
    const { push } = useToast();
    const queryClient = useQueryClient();
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const { data, isLoading, error } = useQuery<MessagesResponse>({
        queryKey: ['admin', 'messages'],
        queryFn: async () => {
            const response = await api.get('/messages', {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        },
        enabled: !!token,
        refetchInterval: 30000,
    });

    const markAsReadMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.patch(`/messages/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/messages/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] });
            push({ type: 'success', message: 'Message deleted' });
            setExpandedId(null);
        },
        onError: () => {
            push({ type: 'error', message: 'Failed to delete' });
        },
    });

    const handleCardClick = (msg: AnonymousMessage) => {
        if (expandedId === msg.id) {
            setExpandedId(null);
        } else {
            setExpandedId(msg.id);
            if (!msg.isRead) {
                markAsReadMutation.mutate(msg.id);
            }
        }
    };

    const handleDelete = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (confirm('Delete this message?')) {
            deleteMutation.mutate(id);
        }
    };

    const truncateMessage = (text: string, maxLength: number = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    };

    const messages = data?.messages ?? [];
    const unreadCount = data?.unreadCount ?? 0;

    return (
        <div className="space-y-8 animate-slide-up">
            <div className="flex items-end justify-between">
                <SectionHeading title="Anonymous Messages" subtitle="Admin" />
                {unreadCount > 0 && (
                    <Badge variant="default" className="gap-2">
                        <Inbox size={14} /> {unreadCount} Unread
                    </Badge>
                )}
            </div>

            {isLoading ? (
                <div className="py-12 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
                    <p className="mt-4 text-sm text-ink/60">Loading messages...</p>
                </div>
            ) : error ? (
                <Card className="text-center py-16">
                    <p className="text-ink/60">Failed to load messages. Please try again.</p>
                </Card>
            ) : messages.length > 0 ? (
                <div className="grid gap-2">
                    {messages.map((msg) => {
                        const isExpanded = expandedId === msg.id;

                        return (
                            <Card
                                key={msg.id}
                                onClick={() => handleCardClick(msg)}
                                className={`cursor-pointer p-5 transition-all duration-normal ${!msg.isRead
                                    ? 'border-l-4 border-l-moss bg-moss/5 hover:bg-moss/8'
                                    : 'hover:bg-ink/3'
                                    } ${isExpanded ? 'shadow-md' : 'hover:shadow-sm'}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`flex-shrink-0 rounded-full p-2.5 ${msg.isRead ? 'bg-ink/10' : 'bg-moss/20'
                                        }`}>
                                        <MessageCircle size={18} className={msg.isRead ? 'text-ink/40' : 'text-moss'} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-4 mb-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {!msg.isRead && (
                                                    <Badge variant="default" className="text-[10px] uppercase tracking-wider bg-moss">
                                                        New
                                                    </Badge>
                                                )}
                                                <span className="text-xs text-ink/50">
                                                    {formatDate(msg.createdAt)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {isExpanded && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => handleDelete(e, msg.id)}
                                                        disabled={deleteMutation.isPending}
                                                        className="h-7 w-7 hover:bg-red-100 hover:text-red-600"
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                )}
                                                <div className="text-ink/30">
                                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </div>
                                            </div>
                                        </div>

                                        <p className={`text-ink/80 leading-relaxed ${isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-2'
                                            }`}>
                                            {isExpanded ? msg.message : truncateMessage(msg.message, 120)}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                    <Mail size={48} strokeWidth={1} className="mb-4 text-ink/40" />
                    <p className="text-lg font-medium">No messages yet</p>
                    <p className="text-sm text-ink/60">Anonymous messages will appear here.</p>
                </div>
            )}
        </div>
    );
}
