import { test, expect } from '@playwright/test';

test('sun and moon toggle persists theme without stopping playback', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('combobox', { name: 'Theme' })).toHaveCount(0);
  await expect(page.locator('.theme-toggle svg')).toBeVisible();
  await page.getByRole('button', { name: 'Start metronome' }).click();
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('button', { name: 'Stop metronome' })).toBeVisible();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  const toggle = page.getByRole('button', { name: 'Switch to dark mode' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('light theme has readable text and distinct control boundaries', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await expect.poll(() => page.evaluate(() => {
    const luminance = (color: string) => {
      const channels = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
      return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
    };
    const ratio = (a: string, b: string) => { const x = luminance(a), y = luminance(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };
    const panel = getComputedStyle(document.querySelector('.instrument')!);
    const hint = getComputedStyle(document.querySelector('.hint')!);
    const step = getComputedStyle(document.querySelector('.step')!);
    const play = getComputedStyle(document.querySelector('.play')!);
    return ratio(hint.color, panel.backgroundColor) >= 4.5 && ratio(step.borderTopColor, panel.backgroundColor) >= 3 && ratio(play.color, play.backgroundColor) >= 4.5;
  })).toBe(true);
});
