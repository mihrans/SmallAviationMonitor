import { test, expect } from '@playwright/test';
import fs from 'fs';

const SNAP_DIR = process.env.SNAP_DIR || 'tests/output/local';

test('homepage anchors and snapshot', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="x-app-name"][content="SmallAviationMonitor"]')).toHaveCount(1);
  await expect(page.locator('meta[name="x-download-mode"][content="pwa-only"]')).toHaveCount(1);
  await expect(page.locator('meta[name="x-build-sha"]')).toHaveCount(1);
  await expect(page.locator('meta[name="x-build-time"]')).toHaveCount(1);
  await page.screenshot({ path: `${SNAP_DIR}/home.png`, fullPage: true });
  const html = await page.content();
  await page.context().storageState({ path: `${SNAP_DIR}/state.json` });
  fs.mkdirSync(SNAP_DIR, { recursive: true });
  fs.writeFileSync(`${SNAP_DIR}/home.html`, html);
});

test('download page PWA-only markers and snapshot', async ({ page }) => {
  await page.goto('/download');
  const bodyText = await page.textContent('body');
  expect(bodyText || '').not.toContain('Download APK');
  expect(bodyText || '').toContain('Launch Web App Now');
  await page.screenshot({ path: `${SNAP_DIR}/download.png`, fullPage: true });
  const html = await page.content();
  fs.mkdirSync(SNAP_DIR, { recursive: true });
  fs.writeFileSync(`${SNAP_DIR}/download.html`, html);
});

test('pwa page loads and snapshot', async ({ page }) => {
  const resp = await page.goto('/pwa');
  expect(resp?.ok()).toBeTruthy();
  await page.screenshot({ path: `${SNAP_DIR}/pwa.png`, fullPage: true });
  const html = await page.content();
  fs.mkdirSync(SNAP_DIR, { recursive: true });
  fs.writeFileSync(`${SNAP_DIR}/pwa.html`, html);
});
