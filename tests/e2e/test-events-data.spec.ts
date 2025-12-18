import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import { paths, remove, prepareDirs, setup, teardown, sleep } from "../utils/testHelper";

test.describe("Agent → Splitter → Targets", () => {
  test.beforeAll(async () => {
    await prepareDirs();
    await remove(paths.target1Output);
    await remove(paths.target2Output);
    await remove(paths.combinedOutput);

    setup();

    // simple wait
    await sleep(6000);
  });

  test.afterAll(async () => {
    teardown();
  });

  test("all events are delivered exactly once (assert against combined events.log)", async () => {
    const input = await fs.readFile(paths.inputFile, "utf8");
    const output1 = await fs.readFile(paths.target1Output, "utf8");
    const output2 = await fs.readFile(paths.target2Output, "utf8");

    const combined = output1 + output2;
    await fs.writeFile(paths.combinedOutput, combined, "utf8");

    const inputEvents = input.split("\n").filter(Boolean);
    const outputEvents = combined.split("\n").filter(Boolean);

    expect(outputEvents.length).toBe(inputEvents.length);
    expect(outputEvents.sort()).toEqual(inputEvents.sort());
  });
});
