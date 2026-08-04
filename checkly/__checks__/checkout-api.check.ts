import { ApiCheck, AssertionBuilder } from 'checkly/constructs'
import { BASE_URL, BUILD_TIME_URL } from './env'

const SYNTHETIC_USER_ID = 'checkly-synthetic-monitoring'

// Pick the first product instead of hardcoding one.
const products = await (await fetch(`${BUILD_TIME_URL}/api/products`)).json()
const firstProduct = products[0]
if (!firstProduct) {
  throw new Error('There are no products to checkout')
}

// Add it to a cart so checkout has something real to order.
await fetch(`${BUILD_TIME_URL}/api/cart`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: SYNTHETIC_USER_ID,
    item: { productId: firstProduct.id, quantity: 1 },
  }),
})

// Note: this places a real order every run. A production version of this
// check would also delete the order afterward - not possible here, this
// app has no delete-order capability.
new ApiCheck('checkout-api-check', {
  name: 'Checkout API',
  request: {
    method: 'POST',
    url: `${BASE_URL}/api/checkout?currencyCode=USD`,
    bodyType: 'JSON',
    body: JSON.stringify({
      userId: SYNTHETIC_USER_ID,
      userCurrency: 'USD',
      address: {
        streetAddress: 'Unter den Linden 1',
        city: 'Berlin',
        state: 'Berlin',
        country: 'Germany',
        zipCode: '10117',
      },
      email: 'checkly-synthetic-monitoring@example.com',
      creditCard: {
        creditCardNumber: '4432-8015-6152-0454',
        creditCardCvv: 672,
        creditCardExpirationYear: 2030,
        creditCardExpirationMonth: 1,
      },
    }),
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.jsonBody('$.orderId').isNotNull(),
    ],
  },
})
