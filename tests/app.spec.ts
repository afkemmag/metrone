import { test, expect } from '@playwright/test';
test('tempo controls and playback work', async ({ page }) => {
 await page.goto('/');
 await expect(page.getByRole('region', { name: 'Metronome', exact: true })).toBeVisible();
 await expect(page.getByRole('spinbutton', { name: 'Tempo' })).toHaveValue('120');
 await page.getByRole('button', { name: 'Increase tempo' }).click();
 await expect(page.getByRole('spinbutton', { name: 'Tempo' })).toHaveValue('121');
 await page.getByRole('button', { name: 'Start metronome' }).click();
 await expect(page.getByRole('button', { name: 'Stop metronome' })).toBeVisible();
 await expect(page.locator('.beat.active')).toHaveCount(1);
 await page.getByRole('button', { name: 'Stop metronome' }).click();
 await expect(page.locator('.beat.active')).toHaveCount(0);
});
