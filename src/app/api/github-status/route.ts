import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 300; // Cache for 5 minutes

interface GitHubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
    url: string;
  };
  payload: {
    commits?: Array<{
      message: string;
      sha: string;
    }>;
    action?: string;
  };
  created_at: string;
}

export async function GET() {
  try {
    const headers = {
      "User-Agent": "rzqllh-portfolio-sync",
      Accept: "application/vnd.github.v3+json",
    };

    const [eventsRes, userRes] = await Promise.all([
      fetch("https://api.github.com/users/rzqllh/events?per_page=10", {
        headers,
        next: { revalidate: 300 },
      }),
      fetch("https://api.github.com/users/rzqllh", {
        headers,
        next: { revalidate: 300 },
      }),
    ]);

    if (!eventsRes.ok || !userRes.ok) {
      return NextResponse.json({
        available: false,
        message: "Unable to fetch live GitHub activity at this time.",
      });
    }

    const events: GitHubEvent[] = await eventsRes.json();
    const user = await userRes.json();

    // Find the latest PushEvent or CreateEvent
    const latestPush = events.find(
      (e) => e.type === "PushEvent" || e.type === "CreateEvent"
    );

    let latestActivity = null;

    if (latestPush) {
      const repoCleanName = latestPush.repo.name.replace(/^rzqllh\//, "");
      const commitMessage =
        latestPush.payload.commits?.[0]?.message || "Updated repository";
      
      latestActivity = {
        type: latestPush.type,
        repoName: repoCleanName,
        repoFullName: latestPush.repo.name,
        repoUrl: `https://github.com/${latestPush.repo.name}`,
        commitMessage: commitMessage.split("\n")[0], // first line only
        createdAt: latestPush.created_at,
      };
    }

    return NextResponse.json({
      available: true,
      username: "rzqllh",
      profileUrl: "https://github.com/rzqllh",
      publicRepos: user.public_repos || 0,
      latestActivity,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[GitHubStatusAPI]", error);
    return NextResponse.json({
      available: false,
      message: "GitHub status unavailable",
    });
  }
}
