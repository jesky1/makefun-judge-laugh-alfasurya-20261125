// Negative tests: the screen must reject invalid or off-topic lines.
// Run: node --test test.mjs test-neg.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { screenEntry, ENTRY } from "./main.ts";

const cases = [
  ["201 characters rejected", "x".repeat(201), "length"],
  ["200 characters exactly accepted", "Office printer jams daily " + "work ".repeat(34) + "work", null],
  ["whitespace-only rejected", "   ", "whitespace"],
  ["empty rejected", "", "length"],
  ["multi-line rejected", "The printer jams\nwhen deadlines loom.", "single line"],
  ["trailing whitespace rejected", "The printer jams. ", "whitespace"],
  ["control character rejected", "The printer jams.\x07", "control"],
  ["invisible character rejected", "The printer\u200bjams.", "invisible"],
  ["no letters rejected", "12345 !!!", "letters"],
  ["fewer than 5 words rejected", "Printer jams daily.", "5 words"],
  ["off-topic rejected", "The cat slept all afternoon on the warm windowsill.", "office life"],
  ["link rejected", "The office printer jams daily see https://example.com for proof.", "links"],
  ["repeated-character spam rejected", "The office printer jaaaaams daily.", "spam"],
  ["original entry accepted", ENTRY, null],
];

for (const [name, input, want] of cases) {
  test(name, () => {
    const problem = screenEntry(input);
    if (want === null) assert.equal(problem, null);
    else assert.ok(problem && problem.includes(want), `got: ${problem}`);
  });
}
