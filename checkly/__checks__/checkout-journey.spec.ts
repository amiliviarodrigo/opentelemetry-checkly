import { test, expect } from '@playwright/test'

test('Complete checkout journey', async ({ page }) => {
  let productName = ''

  await test.step('Load homepage', async () => {
    await page.goto('/')
    await expect(page.locator('[data-cy="home-page"]')).toBeVisible()
    await expect(page.locator('[data-cy="product-list"]')).toBeVisible()
  })

  await test.step('Click a product card', async () => {
    await page.locator('[data-cy="product-card"]').first().click()
    await expect(page.locator('[data-cy="product-detail"]')).toBeVisible()
    const nameLocator = page.locator('[data-cy="product-name"]')
    await expect(nameLocator).not.toHaveText('')
    productName = (await nameLocator.textContent())?.trim() ?? ''
  })

  await test.step('Change quantity', async () => {
    await page.locator('[data-cy="product-quantity"]').selectOption('2')
  })

  await test.step('Add to cart', async () => {
    await page.locator('[data-cy="product-add-to-cart"]').click()
    await expect(page).toHaveURL(/\/cart$/)
  })

  await test.step('Cart shows the right product and quantity', async () => {
    const cartRow = page.locator('section').filter({ hasText: productName })
    await expect(cartRow).toBeVisible()
    await expect(cartRow.getByRole('combobox')).toHaveValue('2')
  })

  await test.step('Shipping and payment forms are pre-filled', async () => {
    await expect(page.locator('#street_address')).not.toHaveValue('')
    await expect(page.locator('#credit_card_number')).not.toHaveValue('')
  })

  await test.step('Place order', async () => {
    const checkoutResponse = page.waitForResponse(
      response => response.url().includes('/api/checkout') && response.request().method() === 'POST'
    )
    await page.locator('[data-cy="checkout-place-order"]').click()
    const response = await checkoutResponse
    expect(response.status()).toBe(200)
  })

  await test.step('Order confirmation shows the right product', async () => {
    await expect(page).toHaveURL(/\/cart\/checkout\//)
    await expect(page.getByText('Your order is complete!')).toBeVisible()
    await expect(page.getByText(productName)).toBeVisible()
  })
})
