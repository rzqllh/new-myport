import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 300;

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
  };
  created_at: string;
}

const username = process.env.GITHUB_PUBLIC_USERNAME || "rzqllh";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.github.com/users/" + username + "/events?per_page=10",
      {
        headers: {
          "User-Agent": "portfolio-public-activity",
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      return NextResponse.json({
        available: false,
        message: "GitHub activity is temporarily unavailable.",
      });
    }

    const events: GitHubEvent[] = await response.json();
    const latestActivityEvent = events.find(
      (event) => event.type === "PushEvent" || event.type === "CreateEvent"
    );

    const latestActivity = latestActivityEvent
      ? {
          type: latestActivityEvent.type,
          repoName: latestActivityEvent.repo.name.replace(
            new RegExp("^" + username + "/"),
            ""
          ),
          repoFullName: latestActivityEvent.repo.name,
          repoUrl: "https://github.com/" + latestActivityEvent.repo.name,
          commitMessage:
            latestActivityEvent.payload.commits?.[0]?.message
              ?.split("\n")[0]
              ?.slice(0, 160) || "Repository updated",
          createdAt: latestActivityEvent.created_at,
        }
      : null;

    return NextResponse.json({
      available: true,
      username,
      profileUrl: "https://github.com/" + username,
      latestActivity,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      available: false,
      message: "GitHub activity is temporarily unavailable.",
    });
  }
}
