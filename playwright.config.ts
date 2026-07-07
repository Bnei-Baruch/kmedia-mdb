import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const baseEN = `${BASE}/en/`;
const baseHE = `${BASE}/he/`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  expect: { timeout: 15_000 },

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // LTR — English
    {
      name: 'desktop-en',
      use: { ...devices['Desktop Chrome'], baseURL: baseEN },
      testIgnore: '**/*-mobile.spec.ts',
    },
    {
      name: 'mobile-en',
      use: { ...devices['iPhone 14'], baseURL: baseEN },
      testIgnore: '**/*-desktop.spec.ts',
    },

    // RTL — Hebrew
    {
      name: 'desktop-he',
      use: { ...devices['Desktop Chrome'], baseURL: baseHE },
      testIgnore: '**/*-mobile.spec.ts',
    },
    {
      name: 'mobile-he',
      use: { ...devices['iPhone 14'], baseURL: baseHE },
      testIgnore: '**/*-desktop.spec.ts',
    },
  ],

  snapshotPathTemplate: 'e2e/snapshots/{projectName}/{testFilePath}/{arg}{ext}',
});
