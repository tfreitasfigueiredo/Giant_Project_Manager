const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

const routes = [
  "/dashboard",
  "/projects",
  "/projects/boge",
  "/projects/boge/activities",
  "/projects/boge/risks",
  "/projects/boge/issues",
  "/projects/boge/status-report",
];

function buildUrl(route) {
  return new URL(route, baseUrl).toString();
}

async function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

const failures = [];

for (const route of routes) {
  const url = buildUrl(route);
  const startedAt = performance.now();

  try {
    const response = await fetchWithTimeout(url);
    const elapsedMs = Math.round(performance.now() - startedAt);
    const ok = response.status >= 200 && response.status < 300;
    const marker = ok ? "OK" : "FAIL";

    console.log(`${marker} ${route} ${response.status} ${elapsedMs}ms`);

    if (!ok) {
      failures.push(`${route} returned ${response.status}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`FAIL ${route} ERROR ${message}`);
    failures.push(`${route} failed: ${message}`);
  }
}

if (failures.length) {
  console.error("\nSmoke routes failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`\nSmoke routes passed for ${routes.length} routes at ${baseUrl}.`);
