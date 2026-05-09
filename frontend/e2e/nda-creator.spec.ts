import { test, expect } from '@playwright/test';

test.describe('Mutual NDA Creator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with header, form, and preview', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Mutual NDA Creator' })).toBeVisible();
    await expect(page.getByText('Agreement Details')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Mutual Non-Disclosure Agreement' })).toBeVisible();
  });

  test('download buttons are visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Download .md/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Print \/ Save PDF/ })).toBeVisible();
  });

  test('default purpose appears highlighted in the preview', async ({ page }) => {
    const defaultPurpose = 'Evaluating whether to enter into a business relationship with the other party.';
    const highlighted = page.locator('main .bg-yellow-100').filter({ hasText: defaultPurpose }).first();
    await expect(highlighted).toBeVisible();
  });

  test('changing purpose updates the preview live', async ({ page }) => {
    const purposeField = page.locator('aside').getByPlaceholder(/Evaluating whether/);
    await purposeField.fill('Testing our new software product');

    const preview = page.locator('main');
    await expect(
      preview.locator('.bg-yellow-100').filter({ hasText: 'Testing our new software product' }).first()
    ).toBeVisible();
  });

  test('purpose appears in multiple highlighted spans in the standard terms', async ({ page }) => {
    const purposeField = page.locator('aside').getByPlaceholder(/Evaluating whether/);
    await purposeField.fill('Joint product evaluation');

    const highlighted = page.locator('main .bg-yellow-100').filter({ hasText: 'Joint product evaluation' });
    await expect(highlighted).toHaveCount(4);
  });

  test('filling party names shows them in the signature table', async ({ page }) => {
    const nameInputs = page.locator('aside').getByPlaceholder('Full name');
    await nameInputs.nth(0).fill('Alice Johnson');
    await nameInputs.nth(1).fill('Bob Williams');

    const signatureTable = page.locator('main table');
    await expect(signatureTable.locator('.bg-yellow-100').filter({ hasText: 'Alice Johnson' })).toBeVisible();
    await expect(signatureTable.locator('.bg-yellow-100').filter({ hasText: 'Bob Williams' })).toBeVisible();
  });

  test('company name appears highlighted in signature table header', async ({ page }) => {
    const companyInputs = page.locator('aside').getByPlaceholder('Company name');
    await companyInputs.nth(0).fill('TechCorp Inc');

    const tableHeaders = page.locator('main th');
    await expect(tableHeaders.filter({ hasText: 'TechCorp Inc' })).toBeVisible();
  });

  test('governing law appears highlighted in preview (cover page + section 9)', async ({ page }) => {
    await page.locator('aside').getByPlaceholder('e.g. Delaware').fill('California');

    const highlighted = page.locator('main .bg-yellow-100').filter({ hasText: 'California' });
    // 1 in cover page + 2 in section 9 = 3 total
    await expect(highlighted).toHaveCount(3);
  });

  test('jurisdiction appears highlighted in preview (cover page + section 9)', async ({ page }) => {
    await page.locator('aside').getByPlaceholder('e.g. New Castle, DE').fill('San Francisco, CA');

    const highlighted = page.locator('main .bg-yellow-100').filter({ hasText: 'San Francisco, CA' });
    // 1 in cover page + 2 in section 9 = 3 total
    await expect(highlighted).toHaveCount(3);
  });

  test('switching to until_terminated updates the MNDA term display', async ({ page }) => {
    await page.locator('aside').getByText('Continues until terminated').click();
    const preview = page.locator('main');
    await expect(preview.locator('.bg-yellow-100').filter({ hasText: /the date of termination/ })).toBeVisible();
  });

  test('MNDA term year input is disabled when until_terminated is selected', async ({ page }) => {
    await page.locator('aside').getByText('Continues until terminated').click();
    await expect(page.getByRole('spinbutton', { name: 'MNDA term years' })).toBeDisabled();
  });

  test('switching to perpetuity confidentiality updates section 5 of the preview', async ({ page }) => {
    await page.locator('aside').getByText('In perpetuity').click();
    const preview = page.locator('main');
    await expect(preview.locator('.bg-yellow-100').filter({ hasText: 'in perpetuity' })).toBeVisible();
  });

  test('whitespace-only governing law shows fallback placeholder', async ({ page }) => {
    await page.locator('aside').getByPlaceholder('e.g. Delaware').fill('   ');
    const preview = page.locator('main');
    await expect(preview.getByText('[Governing Law]').first()).toBeVisible();
  });

  test('effective date appears in signature table Date row', async ({ page }) => {
    await page.locator('aside').locator('input[type="date"]').fill('2026-05-09');
    const signatureTable = page.locator('main table');
    const dateCells = signatureTable.locator('td .bg-yellow-100').filter({ hasText: 'May 9, 2026' });
    await expect(dateCells).toHaveCount(2);
  });

  test('markdown download triggers file download', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Download .md/ }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('mutual-nda.md');
  });
});
