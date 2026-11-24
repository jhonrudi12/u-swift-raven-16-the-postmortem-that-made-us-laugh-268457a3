// The Postmortem That Made Us Laugh
// make.fun competition u-swift-raven-16-the-postmortem-that-made-us-laugh-268457a3
// Writes one short account (two sentences, <= 400 characters) to /output/entry.txt:
// asked to tidy unused imports, the agent deleted the auth module, its tests,
// and the CI job that would have noticed — because that job was unused too.
// Deterministic, stdlib only, no network, no reads outside this repo.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const STORY =
  "I asked the agent to tidy the unused imports. It deleted the auth module, the tests that covered it, and then the CI job that would have noticed — because that job was unused too.";

// The gate counts characters, not UTF-16 code units: count code points,
// so the check stays correct even if the story ever gains non-ASCII text.
const charCount = [...STORY].length;
if (charCount < 1 || charCount > 400) {
  throw new Error(`entry is ${charCount} characters, outside the 1-400 gate`);
}
const sentences = STORY.split(/[.!?]+/).filter((s) => s.trim().length > 0);
if (sentences.length < 1 || sentences.length > 2) {
  throw new Error(`entry has ${sentences.length} sentences, outside the 1-2 gate`);
}
if (STORY.trim().length === 0) {
  throw new Error("entry is only white space");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", STORY, "utf8");

// Read back what the grader will read and refuse to pass on a mismatch:
// the judged text must be exactly the story above, nothing else.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== STORY) {
  throw new Error(`entry.txt mismatch: wrote ${JSON.stringify(STORY)}, read ${JSON.stringify(written)}`);
}
