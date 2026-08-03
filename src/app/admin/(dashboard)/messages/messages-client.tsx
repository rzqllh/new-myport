"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminCard } from "@/components/admin/admin-card";
import {
  Envelope,
  EnvelopeOpen,
  Trash,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  is_read: boolean;
  is_spam: boolean;
  created_at: string;
}

interface MessagesClientProps {
  initialMessages: Message[];
}

export function MessagesClient({ initialMessages }: MessagesClientProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const unreadCount = messages.filter((m) => !m.is_read && !m.is_spam).length;

  async function toggleRead(msg: Message) {
    setLoadingId(msg.id);
    const next = !msg.is_read;
    const { error } = await supabase
      .from("messages")
      .update({ is_read: next })
      .eq("id", msg.id);

    if (!error) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: next } : m))
      );
    }
    setLoadingId(null);
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message? This cannot be undone.")) return;
    setLoadingId(id);
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", id);

    if (!error) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
    setLoadingId(null);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
        <Envelope weight="duotone" size={40} className="opacity-30" />
        <p className="text-sm">No messages yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{unreadCount}</span>{" "}
          unread message{unreadCount > 1 ? "s" : ""}
        </p>
      )}

      <AdminCard>
        {messages
          .filter((m) => !m.is_spam)
          .map((msg) => {
            const isExpanded = expandedId === msg.id;
            const isLoading = loadingId === msg.id;

            return (
              <div
                key={msg.id}
                className={cn(
                  "transition-colors",
                  !msg.is_read && "bg-primary/5"
                )}
              >
                {/* Row header */}
                <button
                  type="button"
                  className="w-full text-left px-5 py-4 flex items-start gap-4 transition-colors hover:bg-muted/10"
                  onClick={() =>
                    setExpandedId((prev) => (prev === msg.id ? null : msg.id))
                  }
                >
                  <div className="mt-0.5 shrink-0 text-muted-foreground">
                    {msg.is_read ? (
                      <EnvelopeOpen weight="duotone" size={18} />
                    ) : (
                      <Envelope weight="fill" size={18} className="text-primary" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          "text-sm truncate",
                          !msg.is_read && "font-semibold text-foreground"
                        )}
                      >
                        {msg.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {msg.email}
                      </span>
                      {!msg.is_read && (
                        <Badge variant="default" className="text-xs py-0 h-5">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                      {msg.subject || "(no subject)"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {formatDate(msg.created_at)}
                    </span>
                    {isExpanded ? (
                      <CaretUp weight="bold" size={14} className="text-muted-foreground" />
                    ) : (
                      <CaretDown weight="bold" size={14} className="text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded body */}
                {isExpanded && (
                  <div className="px-5 pb-5 flex flex-col gap-4 border-t border-border/50">
                    <div className="pt-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        {formatDate(msg.created_at)}
                      </p>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {msg.body}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isLoading}
                        onClick={() => toggleRead(msg)}
                      >
                        {msg.is_read ? (
                          <>
                            <Envelope weight="duotone" data-icon="inline-start" />
                            Mark unread
                          </>
                        ) : (
                          <>
                            <EnvelopeOpen weight="duotone" data-icon="inline-start" />
                            Mark read
                          </>
                        )}
                      </Button>
                      <a href={`mailto:${msg.email}`}>
                        <Button size="sm" variant="outline">
                          Reply
                        </Button>
                      </a>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={isLoading}
                        onClick={() => deleteMessage(msg.id)}
                      >
                        <Trash weight="duotone" data-icon="inline-start" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </AdminCard>
    </div>
  );
}
