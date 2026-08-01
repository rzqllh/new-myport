import { createClient } from "@/lib/supabase/server";
import { MessagesClient } from "./messages-client";

export const metadata = {
  title: "Messages — Admin",
};

export default async function MessagesPage() {
  const supabase = await createClient();

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="text-destructive text-sm">
        Failed to load messages: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Messages</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Contact form submissions from visitors.
        </p>
      </div>
      <MessagesClient initialMessages={messages ?? []} />
    </div>
  );
}
