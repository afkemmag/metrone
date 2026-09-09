import { test, expect } from '@playwright/test';

test('pendulum follows beats and resets on stop', async ({ page }) => {
  await page.goto('/');
  const pendulum = page.locator('.pendulum');
  await expect(pendulum).toBeVisible();
  await page.getByRole('button', { name: 'Start metronome' }).click();
  await expect.poll(() => pendulum.evaluate(el => Math.abs(new DOMMatrix(getComputedStyle(el).transform).b))).toBeGreaterThan(0.1);
  const tempo = page.getByRole('spinbutton', { name: 'Tempo' });
  await tempo.fill('240');
  await tempo.blur();
  await expect(page.locator('.metronome-visual')).toHaveAttribute('data-beat-duration', '250');
  await page.getByRole('button', { name: 'Stop metronome' }).click();
  await expect.poll(() => pendulum.evaluate(el => Math.abs(new DOMMatrix(getComputedStyle(el).transform).b))).toBeLessThan(0.001);
});

test('reduced motion keeps pendulum still during playback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start metronome' }).click();
  await expect(page.locator('.beat.active')).toHaveCount(1);
  await expect(page.locator('.metronome-visual')).toHaveAttribute('data-reduced-motion', 'true');
  const angle = await page.locator('.pendulum').evaluate(el => new DOMMatrix(getComputedStyle(el).transform).b);
  expect(angle).toBe(0);
});
