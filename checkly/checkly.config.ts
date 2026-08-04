import { defineConfig } from 'checkly'

/**
 * See https://www.checklyhq.com/docs/cli/project-structure/
 */
const config = defineConfig({
  /* A human friendly name for your project */
  projectName: 'Astronomy Shop Monitoring',
  /** A logical ID that needs to be unique across your Checkly account,
  * See https://www.checklyhq.com/docs/cli/constructs/ to learn more about logical IDs.
  */
  logicalId: 'astronomy-shop-monitoring',
  /* An optional URL to your Git repo */
  repoUrl: 'https://github.com/amiliviarodrigo/opentelemetry-checkly',
  /* Sets default values for Checks */
  checks: {
    /* A default for how often your Check should run in minutes */
    frequency: 10,
    /* The app only runs locally and isn't publicly reachable, so checks run
     * from the Private Location agent (see compose.checkly-agent.yaml)
     * instead of Checkly's public data centers. */
    privateLocations: ['opentelemetry-checkly-local'],
    /* An optional array of tags to organize your Checks */
    tags: ['astronomy-shop'],
    /** The Checkly Runtime identifier, determining npm packages and the Node.js version available at runtime.
     * See https://www.checklyhq.com/docs/cli/npm-packages/
     */
    runtimeId: '2026.04',
    /* A glob pattern that matches the Checks inside your repo, see https://www.checklyhq.com/docs/constructs/including-checks/#checks-checkmatch */
    checkMatch: '**/__checks__/**/*.check.ts',
    /* Global configuration option for Browser and Multistep checks. See https://www.checklyhq.com/docs/browser-checks/playwright-test/#global-configuration
     * baseURL defaults to localhost for local `checkly test` dry-runs; will
     * point at the Private Location's reachable address once that's set up. */
    playwrightConfig: {
      timeout: 30000,
      use: {
        baseURL: process.env.ENVIRONMENT_URL || 'http://localhost:8080',
        viewport: { width: 1280, height: 720 },
      }
    },
    browserChecks: {
      /* A glob pattern matches any Playwright .spec.ts files and automagically creates a Browser Check. This way, you
      * can just write Playwright code. See https://www.checklyhq.com/docs/constructs/including-checks/#browserchecks-testmatch
      * */
      testMatch: '**/__checks__/**/*.spec.ts',
    },
  },
  cli: {
    /* The app only runs locally via the Private Location agent, so
     * ad-hoc `checkly test`/`trigger` runs should default there too,
     * instead of a public datacenter, when no --location flag is given. */
    privateRunLocation: 'opentelemetry-checkly-local',
    /* An array of default reporters to use when a reporter is not specified with the "--reporter" flag */
    reporters: ['list'],
    /* How many times to retry a failing test run when running `npx checkly test` or `npx checkly trigger` (max. 3) */
    retries: 0,
  },
})

export default config
