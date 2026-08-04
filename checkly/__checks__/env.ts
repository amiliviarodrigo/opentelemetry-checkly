// Shared base URL for all API checks. `checkly test` always dispatches to a
// Checkly-side runner (cloud by default, or a Private Location via
// --private-location) — it never runs on your own machine, so plain
// `localhost` only resolves for someone running these files directly outside
// Checkly's dispatch. When running against the local demo via the Private
// Location agent (see compose.checkly-agent.yaml), set ENVIRONMENT_URL to
// the app's internal Docker DNS name, reachable from inside that agent's
// network:
//
//   ENVIRONMENT_URL=http://frontend-proxy:8080 \
//     npx checkly test --private-location=<your-private-location-name>
//
// Verified working 2026-08-04.
export const BASE_URL = process.env.ENVIRONMENT_URL || 'http://localhost:8080'
