import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const publicRoot = resolve(root, "src/app/(public)");
const failures = [];

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const publicFiles = walk(publicRoot).filter((path) => /\.(?:ts|tsx)$/.test(path));
const bannedPublicImports = [
  "@tiptap/",
  "react-image-crop",
  "@/components/admin/",
  "@/lib/supabase/client",
];

for (const file of publicFiles) {
  const source = readFileSync(file, "utf8");
  const relative = file.slice(root.length + 1);

  for (const dependency of bannedPublicImports) {
    if (source.includes(dependency)) {
      failures.push(`${relative} imports public-route-forbidden dependency ${dependency}`);
    }
  }

  if (/\/(?:page|layout)\.tsx$/.test(file) && /^["']use client["'];?/m.test(source)) {
    failures.push(`${relative} turns a route page/layout into a client component`);
  }
}

const publicShellFiles = [
  "src/components/layout/navbar.tsx",
  "src/components/layout/footer.tsx",
  "src/components/public-search.tsx",
  "src/components/chat-widget.tsx",
  "src/components/deferred-chat-widget.tsx",
  "src/components/motion/editorial-reveal.tsx",
];

for (const relative of publicShellFiles) {
  const source = readFileSync(resolve(root, relative), "utf8");
  for (const dependency of ["@tiptap/", "react-image-crop"]) {
    if (source.includes(dependency)) {
      failures.push(`${relative} imports editor-only dependency ${dependency}`);
    }
  }
}

if (failures.length) {
  console.error("Client boundary audit failed:");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}

console.log(
  `Client boundary audit passed for ${publicFiles.length} public route files and ${publicShellFiles.length} public shell files.`
);
