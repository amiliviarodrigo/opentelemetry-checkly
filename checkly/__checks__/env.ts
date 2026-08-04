// URL the deployed check itself calls. Set via ENVIRONMENT_URL, e.g.
// http://frontend-proxy:8080 for the Private Location agent.
export const BASE_URL = process.env.ENVIRONMENT_URL || 'http://localhost:8080'

// URL used to fetch data while building a check (runs on your machine, not
// the agent), so always localhost.
export const BUILD_TIME_URL = 'http://localhost:8080'
