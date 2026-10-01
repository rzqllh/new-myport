"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/components/chat-widget"), {
  ssr: false,
  loading: () => null,
});

interface IdleWindow {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number }
  ) => number;
  cancelIdleCallback?: (id: number) => void;
}

export function DeferredChatWidget() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idleWindow = window as unknown as IdleWindow;

    if (idleWindow.requestIdleCallback) {
      const id = idleWindow.requestIdleCallback(() => setReady(true), {
        timeout: 1500,
      });

      return () => idleWindow.cancelIdleCallback?.(id);
    }

    const id = globalThis.setTimeout(() => setReady(true), 800);
    return () => globalThis.clearTimeout(id);
  }, []);

  return ready ? <ChatWidget /> : null;
}
