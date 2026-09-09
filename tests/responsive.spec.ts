import { test, expect } from '@playwright/test';

test('mobile layout, tempo bounds, and clean browser runtime', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const tempo = page.getByRole('spinbutton', { name: 'Tempo' });
  await tempo.fill('999');
  await tempo.blur();
  await expect(tempo).toHaveValue('240');
  await expect(page.getByRole('button', { name: 'Increase tempo' })).toBeDisabled();
  await tempo.fill('1');
  await tempo.blur();
  await expect(tempo).toHaveValue('30');
  await expect(page.getByRole('button', { name: 'Decrease tempo' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Start metronome' })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
