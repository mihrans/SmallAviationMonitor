import { defineConfig, devices } from '@playwright/test';

const runNumber = process.env.GITHUB_RUN_NUMBER || 'local';
const root = process.cwd().replace(/\\/g, '/');
const outputDir = `${root}/output/${runNumber}`;

export default defineConfig({
  testDir: `${root}/specs`,
  timeout: 60_000,
  fullyParallel: true,
  reporter: [['list'], ['html', { outputFolder: `${outputDir}-report` }]],
  use: {
    baseURL: process.env.BASE_URL || 'https://smallaviationmonitor.pages.dev',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'off',
    actionTimeout: 15_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  outputDir,
});
