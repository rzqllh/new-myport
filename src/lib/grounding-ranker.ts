export type GroundingSourceKind =
  | "profile"
  | "experience"
  | "capability"
  | "work";

export interface GroundingSource {
  id: string;
  kind: GroundingSourceKind;
  title: string;
  path: string;
  content: string;
}

function normalizedTokens(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}

export function selectGroundingSources(
  corpus: GroundingSource[],
  question: string,
  limit = 6
) {
  if (!corpus.length) return [];

  const tokens = normalizedTokens(question);
  if (!tokens.length) {
    return corpus
      .filter(
        (source) =>
          source.kind === "profile" || source.kind === "experience"
      )
      .slice(0, limit);
  }

  const scored = corpus
    .map((source, index) => {
      const title = source.title.toLowerCase();
      const content = source.content.toLowerCase();
      const path = source.path.toLowerCase();

      const score = tokens.reduce((total, token) => {
        if (title === token) return total + 12;
        if (title.startsWith(token)) return total + 8;
        if (title.includes(token)) return total + 5;
        if (content.includes(token)) return total + 2;
        if (path.includes(token)) return total + 1;
        return total;
      }, 0);

      return { source, score, index };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((item) => item.source);

  if (scored.length) return scored;

  return corpus
    .filter(
      (source) =>
        source.kind === "profile" || source.kind === "experience"
    )
    .slice(0, Math.min(limit, 3));
}

export function formatGroundingSources(sources: GroundingSource[]) {
  if (!sources.length) {
    return "No verified public portfolio content matched this question.";
  }

  return sources
    .map(
      (source, index) =>
        [
          "SOURCE " + String(index + 1),
          "title: " + source.title,
          "path: " + source.path,
          "kind: " + source.kind,
          "content:",
          source.content,
        ].join("\n")
    )
    .join("\n\n");
}
