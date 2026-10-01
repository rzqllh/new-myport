"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/components/chat-widget"), {
  ssr: false,
  loading: () => null,
});

export function DeferredChatWidget() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setReady(true), {
        timeout: 1500,
      });
      return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(() => setReady(true), 800);
    return () => window.clearTimeout(id);
  }, []);

  return ready ? <ChatWidget /> : null;
}
