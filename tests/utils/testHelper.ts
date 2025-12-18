import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const assignment = path.join(root, "assignment");

export const paths = {
  inputFile: path.join(assignment, "agent", "inputs", "large_1M_events.log"),
  target1Output: path.join(assignment, "artifacts", "target_1", "events.log"),
  target2Output: path.join(assignment, "artifacts", "target_2", "events.log"),
  combinedOutput: path.join(assignment, "target", "events.log"),
};

export async function remove(filePath: string) {
  try {
    await fs.unlink(filePath);
  } catch {
    // ignore
  }
}

export async function prepareDirs() {
  // artifact folders per “host”
  await fs.mkdir(path.join(assignment, "artifacts", "agent"), { recursive: true });
  await fs.mkdir(path.join(assignment, "artifacts", "splitter"), { recursive: true });
  await fs.mkdir(path.join(assignment, "artifacts", "target_1"), { recursive: true });
  await fs.mkdir(path.join(assignment, "artifacts", "target_2"), { recursive: true });

  // folder for the combined output we generate
  await fs.mkdir(path.dirname(paths.combinedOutput), { recursive: true });
}

export function setup() {
  execSync("docker compose up -d", { stdio: "inherit" });
}

export function teardown() {
  execSync("docker compose down -v", { stdio: "inherit" });
}

export async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}
