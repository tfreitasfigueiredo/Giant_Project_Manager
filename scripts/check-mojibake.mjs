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

const mojibakeContinuation = "[\\u0080-\\u00bf\\u0152\\u0153\\u0160\\u0161\\u0178\\u017d\\u017e\\u0192\\u02c6\\u02dc\\u2018-\\u201e\\u2020-\\u2026\\u2030\\u2039\\u203a\\u20ac\\u2122]";

const suspiciousPatterns = [
  {
    label: "latin1 utf8 mojibake",
    regex: new RegExp(`\\u00c3${mojibakeContinuation}`, "g"),
  },
  {
    label: "latin1 non-breaking mojibake",
    regex: new RegExp(`\\u00c2${mojibakeContinuation}`, "g"),
  },
  {
    label: "replacement character",
    regex: /\ufffd/g,
  },
  {
    label: "smart punctuation mojibake",
    regex: new RegExp(`\\u00e2\\u20ac${mojibakeContinuation}?`, "g"),
  },
  {
    label: "emoji mojibake",
    regex: new RegExp(`\\u00f0${mojibakeContinuation}`, "g"),
  },
];

function fromCodePoints(values) {
  return String.fromCodePoint(...values);
}

function validateDetector() {
  const corruptedExamples = [
    fromCodePoints([0x004f, 0x0070, 0x0065, 0x0072, 0x0061, 0x00c3, 0x00a7, 0x00c3, 0x00b5, 0x0065, 0x0073]),
    fromCodePoints([0x004e, 0x00c3, 0x00a3, 0x006f, 0x0020, 0x0069, 0x006e, 0x0069, 0x0063, 0x0069, 0x0061, 0x0064, 0x0061]),
    fromCodePoints([0x0043, 0x006f, 0x006e, 0x0063, 0x006c, 0x0075, 0x00c3, 0x00ad, 0x0064, 0x0061]),
    fromCodePoints([0x0049, 0x006d, 0x0070, 0x006c, 0x0061, 0x006e, 0x0074, 0x0061, 0x00c3, 0x00a7, 0x00c3, 0x00a3, 0x006f]),
    fromCodePoints([0x0056, 0x0061, 0x006c, 0x0069, 0x0064, 0x0061, 0x00c3, 0x00a7, 0x00c3, 0x00a3, 0x006f]),
    fromCodePoints([0x0041, 0x0074, 0x0075, 0x0061, 0x006c, 0x0069, 0x007a, 0x0061, 0x00c3, 0x00a7, 0x00c3, 0x00a3, 0x006f]),
    fromCodePoints([0x0054, 0x0065, 0x0078, 0x0074, 0x006f, 0x0020, 0xfffd]),
    fromCodePoints([0x0041, 0x0073, 0x0070, 0x0061, 0x0073, 0x0020, 0x00e2, 0x20ac, 0x009d]),
    fromCodePoints([0x0045, 0x006d, 0x006f, 0x006a, 0x0069, 0x0020, 0x00f0, 0x0178, 0x0098, 0x0080]),
  ];

  const legitimateExamples = [
    "SÃO PAULO",
    "Âmbito do projeto",
    "Ângulo de análise",
    "Operações",
    "Não iniciada",
    "Concluída",
    "Implantação",
    "Validação",
    "Atualização",
  ];

  const missedCorruptedExample = corruptedExamples.find((example) => !findSuspiciousMatches(example).length);
  if (missedCorruptedExample) {
    throw new Error("Encoding detector self-test failed: corrupted sample was not detected.");
  }

  const rejectedLegitimateExample = legitimateExamples.find((example) => findSuspiciousMatches(example).length);
  if (rejectedLegitimateExample) {
    throw new Error(`Encoding detector self-test failed: legitimate sample was rejected: ${rejectedLegitimateExample}`);
  }
}

function findSuspiciousMatches(content) {
  const matches = [];

  for (const pattern of suspiciousPatterns) {
    pattern.regex.lastIndex = 0;
    let match = pattern.regex.exec(content);
    while (match) {
      matches.push({
        index: match.index,
        label: pattern.label,
      });
      match = pattern.regex.exec(content);
    }
  }

  return matches;
}

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

validateDetector();

for (const file of files) {
  const content = await readFile(file, "utf8");
  for (const match of findSuspiciousMatches(content)) {
    findings.push({
      file: path.relative(root, file),
      pattern: match.label,
      ...lineInfo(content, match.index),
    });
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
