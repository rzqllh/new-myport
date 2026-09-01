"use client";

import { useEffect, useState } from "react";
import { GithubLogo, ArrowUpRight, GitCommit } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface GitHubStatus {
  available: boolean;
  username?: string;
  profileUrl?: string;
  publicRepos?: number;
  latestActivity?: {
    type: string;
    repoName: string;
    repoFullName: string;
    repoUrl: string;
    commitMessage: string;
    createdAt: string;
  } | null;
}

function getRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    const days = Math.floor(diffInSeconds / 86400);
    if (days === 1) return "yesterday";
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "recently";
  }
}

export function GitHubActivityBadge({ className }: { className?: string }) {
  const [status, setStatus] = useState<GitHubStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/github-status")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setStatus(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading || !status?.available || !status.latestActivity) {
    return null;
  }

  const { latestActivity } = status;
  const timeAgo = getRelativeTime(latestActivity.createdAt);

  return (
    <a
      href={latestActivity.repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full",
        "bg-card/80 hover:bg-card border border-border/70 hover:border-foreground/20",
        "text-xs text-muted-foreground hover:text-foreground shadow-sm hover:shadow",
        "transition-all duration-200 backdrop-blur-sm",
        className
      )}
      title={`Latest GitHub push: ${latestActivity.repoName} — "${latestActivity.commitMessage}"`}
    >
      <div className="flex items-center gap-1.5">
        <span
          className="size-2 rounded-full bg-emerald-500 shrink-0"
          style={{ animation: "pulse 2.5s ease-in-out infinite" }}
          aria-hidden="true"
        />
        <GithubLogo weight="fill" className="size-3.5 text-foreground/80" />
      </div>

      <span className="font-mono text-[11px] font-medium text-foreground truncate max-w-[150px] sm:max-w-[200px]">
        {latestActivity.repoName}
      </span>

      <span className="text-[11px] text-muted-foreground shrink-0 flex items-center gap-1">
        <span>·</span>
        <span>{timeAgo}</span>
      </span>

      <ArrowUpRight
        weight="bold"
        className="size-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-muted-foreground group-hover:text-foreground shrink-0"
      />
    </a>
  );
}
