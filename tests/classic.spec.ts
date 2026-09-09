import { test, expect } from '@playwright/test';

test('classic metronome has a tapered case, scale, and winding key', async ({ page }) => {
  await page.goto('/');
  const front = page.locator('.metronome-body .front');
  expect(await front.evaluate(el => getComputedStyle(el).clipPath)).toContain('polygon');
  await expect(page.locator('.winding-key')).toBeVisible();
  await expect(page.locator('.plinth')).toBeVisible();
  await expect(page.locator('.dial')).toContainText('60');
  await expect(page.locator('.dial')).toContainText('208');
});
