import { test, expect } from '@playwright/test'

test('Product detail page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-cy="home-page"]')).toBeVisible()
  await expect(page.locator('[data-cy="product-list"]')).toBeVisible()

  await page.locator('[data-cy="product-card"]').first().click()

  await expect(page.locator('[data-cy="product-detail"]')).toBeVisible()
  await expect(page.locator('[data-cy="product-name"]')).not.toHaveText('')
  await expect(page.locator('[data-cy="product-description"]')).toBeVisible()
  await expect(page.locator('[data-cy="product-quantity"]')).toBeVisible()
  await expect(page.locator('[data-cy="product-add-to-cart"]')).toBeVisible()
})
