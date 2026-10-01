import assert from "node:assert/strict";
import test from "node:test";
import {
  formatGroundingSources,
  selectGroundingSources,
  type GroundingSource,
} from "../src/lib/grounding-ranker.ts";

const corpus: GroundingSource[] = [
  {
    id: "profile",
    kind: "profile",
    title: "Professional profile",
    path: "/about",
    content:
      "IT project management, product development, and technical implementation.",
  },
  {
    id: "exp-pmo",
    kind: "experience",
    title: "Project Management Officer",
    path: "/about",
    content:
      "Coordinates project delivery, stakeholders, reporting, and operational follow-up.",
  },
  {
    id: "work-yomirra",
    kind: "work",
    title: "Yomirra",
    path: "/work/yomirra",
    content:
      "A web reading product using Next.js, TypeScript, source normalization, and a CMS-oriented architecture.",
  },
  {
    id: "work-monitoring",
    kind: "work",
    title: "Network Monitoring Review",
    path: "/work/network-monitoring-review",
    content:
      "A project-management case study covering dashboard review, monitoring data quality, and stakeholder coordination.",
  },
  {
    id: "cap-system",
    kind: "capability",
    title: "Systems thinking",
    path: "/about",
    content:
      "Maps dependencies, constraints, data flows, and operational trade-offs.",
  },
];

test("assistant harness prioritizes exact Work-title matches", () => {
  const results = selectGroundingSources(corpus, "Tell me about Yomirra", 3);

  assert.equal(results[0]?.id, "work-yomirra");
  assert.equal(results[0]?.path, "/work/yomirra");
});

test("assistant harness retrieves project-management evidence across experience and Work", () => {
  const results = selectGroundingSources(
    corpus,
    "What project management and stakeholder work is shown?",
    4
  );

  const ids = results.map((item) => item.id);
  assert.ok(ids.includes("exp-pmo"));
  assert.ok(ids.includes("work-monitoring"));
});

test("assistant harness falls back only to profile or experience for unrelated questions", () => {
  const results = selectGroundingSources(corpus, "quantum horticulture", 4);

  assert.ok(results.length > 0);
  assert.ok(
    results.every(
      (item) => item.kind === "profile" || item.kind === "experience"
    )
  );
});

test("assistant harness respects result limits and emits canonical source metadata", () => {
  const results = selectGroundingSources(corpus, "project work systems", 2);
  const formatted = formatGroundingSources(results);

  assert.equal(results.length, 2);
  assert.match(formatted, /SOURCE 1/);
  assert.match(formatted, /path: \/(?:about|work\/)/);
  assert.doesNotMatch(formatted, /https?:\/\//);
});

test("assistant harness emits an explicit unavailable corpus for empty grounding", () => {
  assert.equal(
    formatGroundingSources([]),
    "No verified public portfolio content matched this question."
  );
});
