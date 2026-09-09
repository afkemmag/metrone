import { test, expect } from '@playwright/test';

test('page renders the 3D metronome with depth instead of the original', async ({ page }) => {
  await page.goto('/');
  const scene = page.locator('.metronome-3d');
  await expect(scene).toBeVisible();
  await expect(page.locator('.metronome-visual')).toHaveCount(1);
  await expect(page.locator('.housing')).toHaveCount(0);
  expect(await scene.evaluate(el => getComputedStyle(el).perspective)).not.toBe('none');
  expect(await page.locator('.metronome-body').evaluate(el => {
    const style = getComputedStyle(el);
    return style.transformStyle === 'preserve-3d' && !new DOMMatrix(style.transform).is2D;
  })).toBe(true);
  await expect(page.locator('.body-face')).toHaveCount(6);
  await page.getByRole('button', { name: 'Start metronome' }).click();
  await expect.poll(() => page.locator('.pendulum').evaluate(el => new DOMMatrix(getComputedStyle(el).transform).b), { intervals: [50] }).toBeGreaterThan(0.1);
  await expect.poll(() => page.locator('.pendulum').evaluate(el => new DOMMatrix(getComputedStyle(el).transform).b), { intervals: [50] }).toBeLessThan(-0.1);
});
