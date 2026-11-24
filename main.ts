// Entry for make.fun's "One Line of Earned Pride" bounty.
//
// The program writes exactly one original line of text to
// <OUTPUT_DIR>/entry.txt (default /output/entry.txt) and validates
// it first: one line, 1-240 characters, valid UTF-8, no trailing
// newline in the file.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry itself: a quiet, earned moment of pride. Three years of
// dawn shifts, and the first loaf finally comes out right — handled
// gently, like it might bruise.
const ENTRY_LINE =
  "After three years of dawn shifts, the apprentice baker pulled his first loaf from the oven and set it down gently, like it might bruise.";

const MIN_LENGTH = 1;
const MAX_LENGTH = 240;
const FILENAME = "entry.txt";

function countCharacters(text: string): number {
  // Spread by code point so multi-byte characters count once.
  return [...text].length;
}

function checkLine(line: string): { chars: number; bytes: number } {
  const chars = countCharacters(line);
  const bytes = Buffer.byteLength(line, "utf8");

  if (chars < MIN_LENGTH || chars > MAX_LENGTH) {
    throw new Error(
      `entry length ${chars} is outside the allowed ${MIN_LENGTH}-${MAX_LENGTH} characters`,
    );
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("entry must fit on a single line");
  }
  if (line !== line.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  if (Buffer.from(line, "utf8").toString("utf8") !== line) {
    throw new Error("entry is not valid UTF-8");
  }

  return { chars, bytes };
}

function resolveOutputDir(): string {
  const dir = process.env.OUTPUT_DIR;
  return dir && dir.length > 0 ? dir : "/output";
}

function run(): void {
  const { chars, bytes } = checkLine(ENTRY_LINE);

  const outputDir = resolveOutputDir();
  mkdirSync(outputDir, { recursive: true });

  const outputPath = join(outputDir, FILENAME);
  writeFileSync(outputPath, ENTRY_LINE, { encoding: "utf8" });

  console.log(`wrote ${outputPath}`);
  console.log(`characters: ${chars}`);
  console.log(`bytes: ${bytes}`);
}

run();
