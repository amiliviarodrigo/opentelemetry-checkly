import { test, expect } from '@playwright/test'

test('Homepage loads and displays products', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('[data-cy="home-page"]')).toBeVisible()
  await expect(page.locator('[data-cy="product-list"]')).toBeVisible()
  await expect(page.locator('[data-cy="product-card"]').first()).toBeVisible()
})
