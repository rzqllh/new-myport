"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ChatCircle,
  PaperPlaneRight,
  X,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PUBLIC_UI,
  localeFromPathname,
  publicPath,
} from "@/lib/content/public-routes";

interface ChatSource {
  title: string;
  path: string;
  kind: "profile" | "experience" | "capability" | "work";
}

interface ChatMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>;
  sources?: ChatSource[];
}

interface ChatResponse {
  message?: string;
  sessionToken?: string;
  sources?: ChatSource[];
  error?: string;
  code?: string;
}

export default function ChatWidget() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const locale = localeFromPathname(pathname);
  const ui = PUBLIC_UI[locale];

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      parts: [{ text: ui.assistantIntro }],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string>();

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = globalThis.setTimeout(() => inputRef.current?.focus(), 80);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      globalThis.clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isLoading) return;

    const history = messages;
    const userMessage: ChatMessage = {
      role: "user",
      parts: [{ text }],
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let activeToken = sessionToken;
      let responseData: ChatResponse | null = null;

      for (let attempt = 0; attempt < 2; attempt += 1) {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...history, userMessage],
            ...(activeToken ? { sessionToken: activeToken } : {}),
          }),
        });

        const data = (await response.json()) as ChatResponse;

        if (
          response.status === 401 &&
          data.code === "SESSION_EXPIRED" &&
          attempt === 0
        ) {
          activeToken = undefined;
          setSessionToken(undefined);
          continue;
        }

        if (!response.ok) {
          throw new Error(data.error || ui.assistantError);
        }

        responseData = data;
        break;
      }

      if (!responseData?.message) {
        throw new Error(ui.assistantError);
      }

      if (responseData.sessionToken) {
        setSessionToken(responseData.sessionToken);
      }

      setMessages((current) => [
        ...current,
        {
          role: "model",
          parts: [{ text: responseData.message ?? ui.assistantError }],
          sources: responseData.sources ?? [],
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "model",
          parts: [{ text: ui.assistantError }],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            key="chat-toggle"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.16, ease: [0.22, 1, 0.36, 1] }
            }
            className="fixed bottom-4 right-4 z-40"
          >
            <Button
              variant="outline"
              className="h-11 gap-2 bg-background shadow-sm"
              onClick={() => setIsOpen(true)}
              aria-label={ui.assistantOpen}
            >
              <ChatCircle className="size-4" />
              <span className="hidden sm:inline">{ui.assistantTitle}</span>
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen ? (
          <motion.section
            key="chat-window"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-heading"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
            }
            className="fixed bottom-4 right-4 z-50 flex h-[min(620px,calc(100dvh-2rem))] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden border border-border bg-background shadow-xl"
          >
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 id="chat-heading" className="text-sm font-semibold">
                  {ui.assistantTitle}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {locale === "id" ? "Berbasis konten publik" : "Grounded in public content"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsOpen(false)}
                aria-label={ui.assistantClose}
              >
                <X className="size-4" />
              </Button>
            </header>

            <div
              ref={scrollRef}
              aria-live="polite"
              className="flex-1 space-y-5 overflow-y-auto px-4 py-5"
            >
              {messages.map((message, index) => (
                <article
                  key={index}
                  className={
                    message.role === "user"
                      ? "ml-auto max-w-[88%] border-l-2 border-primary pl-3"
                      : "max-w-[92%]"
                  }
                >
                  <p
                    className={
                      message.role === "user"
                        ? "text-sm leading-6 text-foreground"
                        : "whitespace-pre-wrap text-sm leading-6 text-foreground"
                    }
                  >
                    {message.parts[0]?.text}
                  </p>

                  {message.role === "model" && message.sources?.length ? (
                    <div className="mt-3 border-t border-border pt-3">
                      <p className="text-[11px] font-medium text-muted-foreground">
                        {ui.assistantSources}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
                        {Array.from(
                          new Map(
                            message.sources.map((source) => [source.path, source])
                          ).values()
                        ).map((source) => (
                          <Link
                            key={source.path}
                            href={publicPath(locale, source.path)}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                            onClick={() => setIsOpen(false)}
                          >
                            {source.title}
                            <ArrowUpRight className="size-3" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </article>
              ))}

              {isLoading ? (
                <p className="text-sm text-muted-foreground" role="status">
                  {locale === "id" ? "Menelusuri portofolio…" : "Checking the portfolio…"}
                </p>
              ) : null}
            </div>

            <form
              className="border-t border-border p-3"
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage();
              }}
            >
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={ui.assistantInput}
                  disabled={isLoading}
                  maxLength={4000}
                  aria-label={ui.assistantInput}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  aria-label={ui.assistantSend}
                >
                  <PaperPlaneRight className="size-4" />
                </Button>
              </div>
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </>
  );
}
