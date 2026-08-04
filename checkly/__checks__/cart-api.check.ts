import { ApiCheck, AssertionBuilder } from 'checkly/constructs'
import { BASE_URL, BUILD_TIME_URL } from './env'

// A fresh session ID always returns an empty cart, no error - this just
// checks the endpoint is up and responding correctly.
new ApiCheck('cart-api-check', {
  name: 'Cart API',
  request: {
    method: 'GET',
    url: `${BASE_URL}/api/cart?sessionId=checkly-synthetic-monitoring&currencyCode=USD`,
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.jsonBody('$.items').isNotNull(),
    ],
  },
})

// Actually adds an item to a cart, unlike the read-only check above.
// Pick the first product instead of hardcoding one.
const products = await (await fetch(`${BUILD_TIME_URL}/api/products`)).json()
const firstProduct = products[0]
if (!firstProduct) {
  throw new Error('There are no products to add to the cart')
}

new ApiCheck('cart-add-item-api-check', {
  name: 'Cart API - Add Item',
  request: {
    method: 'POST',
    url: `${BASE_URL}/api/cart`,
    bodyType: 'JSON',
    body: JSON.stringify({
      userId: 'checkly-synthetic-monitoring-write',
      item: { productId: firstProduct.id, quantity: 1 },
    }),
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.jsonBody('$.items[0].productId').equals(firstProduct.id),
    ],
  },
})
