import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const ignoredDirectories = new Set([
  ".git",
  ".next",
  ".turbo",
  "coverage",
  "dist",
  "node_modules",
]);

const ignoredPathFragments = [
  `${path.sep}src${path.sep}generated${path.sep}`,
];

const textExtensions = new Set([
  ".cjs",
  ".css",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".prisma",
  ".sql",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
  ".yaml",
]);

const textFileNames = new Set([
  ".editorconfig",
  ".env.example",
  ".gitignore",
  "AGENTS.md",
  "components.json",
  "eslint.config.mjs",
  "next.config.ts",
  "package.json",
  "postcss.config.mjs",
  "README.md",
  "tsconfig.json",
]);

const suspiciousPatterns = [
  { label: "latin1 utf8 marker", value: "\u00c3" },
  { label: "latin1 non-breaking marker", value: "\u00c2" },
  { label: "replacement character", value: "\ufffd" },
  { label: "smart punctuation mojibake", value: "\u00e2\u20ac" },
  { label: "emoji mojibake", value: "\u00f0\u0178" },
];

function shouldIgnoreDirectory(name) {
  return ignoredDirectories.has(name);
}

function shouldCheckFile(filePath) {
  const relativePath = path.relative(root, filePath);
  if (ignoredPathFragments.some((fragment) => filePath.includes(fragment))) return false;
  if (textFileNames.has(path.basename(filePath))) return true;
  if (relativePath.startsWith(`.github${path.sep}`)) return true;
  return textExtensions.has(path.extname(filePath));
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!shouldIgnoreDirectory(entry.name)) {
        files.push(...await collectFiles(entryPath));
      }
      continue;
    }

    if (entry.isFile() && shouldCheckFile(entryPath)) {
      files.push(entryPath);
    }
  }

  return files;
}

function lineInfo(content, index) {
  const before = content.slice(0, index);
  const line = before.split(/\r?\n/).length;
  const lineStart = content.lastIndexOf("\n", index - 1) + 1;
  const lineEndIndex = content.indexOf("\n", index);
  const lineEnd = lineEndIndex === -1 ? content.length : lineEndIndex;
  const text = content.slice(lineStart, lineEnd).trim();

  return { line, text };
}

const files = await collectFiles(root);
const findings = [];

for (const file of files) {
  const content = await readFile(file, "utf8");
  for (const pattern of suspiciousPatterns) {
    let index = content.indexOf(pattern.value);
    while (index !== -1) {
      findings.push({
        file: path.relative(root, file),
        pattern: pattern.label,
        ...lineInfo(content, index),
      });
      index = content.indexOf(pattern.value, index + pattern.value.length);
    }
  }
}

if (findings.length) {
  console.error("Mojibake suspeito encontrado:");
  for (const finding of findings) {
    console.error(`${finding.file}:${finding.line} [${finding.pattern}] ${finding.text}`);
  }
  process.exit(1);
}

console.log(`Encoding check passed. ${files.length} text files scanned.`);
