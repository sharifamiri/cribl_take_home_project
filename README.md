# cribl_take_home_project

Take-home SDET assignment for Cribl.
Playwright-based end-to-end automation validates data flow across Agent → Splitter → Targets.

## What this project does

- Runs the provided Node applications inside Docker containers:
  - agent reads an input log file and sends events to splitter
  - splitter forwards events to target_1 and target_2
  - each target writes received events to events.log
- Runs a Playwright end-to-end test that:
  - starts all containers using Docker Compose
  - waits for data to flow through the system
  - reads the input file
  - reads both target output files
  - combines both outputs
  - validates that every input event is delivered exactly once

## Prerequisites

- Node.js (recommended version: 12 or newer)
- npm
- Docker (Docker Desktop on macOS)

## Repository structure

- assignment/
  - provided application code and configuration
- tests/
  - Playwright end-to-end tests
- docker-compose.yml
  - Docker configuration for Agent, Splitter, and Targets
- README.md
  - project documentation

## Install dependencies

From the repository root directory, run:

npm install
npx playwright install

## Run the applications with Docker (manual)

From the repository root:

docker compose up --build

To stop and clean up containers:

docker compose down

## Logs and artifacts

Each application writes its standard output to a dedicated folder:

- assignment/artifacts/agent/stdout.log
- assignment/artifacts/splitter/stdout.log
- assignment/artifacts/target_1/stdout.log
- assignment/artifacts/target_2/stdout.log

Each target also writes received events to its own events.log file under its artifact folder.

## Run the Playwright test (outside CI)

Run the test with a single worker to keep execution simple and deterministic:

npx playwright test --workers=1

The test performs the following steps:
1. Starts all Docker containers
2. Waits for events to flow through the system
3. Reads target output files
4. Combines target outputs into a single file
5. Validates that all input events are delivered exactly once
6. Stops and removes Docker containers

## CI / CD

This project uses GitHub Actions for continuous integration.

The CI pipeline runs automatically on every push and pull request.
It installs dependencies, runs the Playwright end-to-end tests, and uploads test artifacts.

The CI configuration is located at:
.github/workflows/ci.yml

Test artifacts (logs and reports) are available in the GitHub Actions run results.

## Troubleshooting

If the test fails:
- Check stdout.log files under assignment/artifacts/
- Ensure Docker is running
- Verify that hostnames in configuration files match Docker service names
- Confirm that port 9997 is used consistently
