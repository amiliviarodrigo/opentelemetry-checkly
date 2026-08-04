import { ApiCheck, AssertionBuilder } from 'checkly/constructs'
import { BASE_URL } from './env'

const SYNTHETIC_USER_ID = 'checkly-synthetic-monitoring'

// This fetch runs at build time (when this check is tested/deployed), on
// whoever's machine runs that command - always reachable via localhost
// there, regardless of what BASE_URL/ENVIRONMENT_URL resolves to for the
// deployed check itself (e.g. the agent-only frontend-proxy hostname).
// Never hardcode a specific product ID, since the catalog can change - pick
// whatever's first instead, refreshed on every deploy.
const BUILD_TIME_URL = 'http://localhost:8080'
const products = await (await fetch(`${BUILD_TIME_URL}/api/products`)).json()
const firstProduct = products[0]
if (!firstProduct) {
  throw new Error('There are no products to checkout')
}

// Seed a cart for the synthetic user so the checkout request below places
// a real, complete order through the full critical path - not just an
// empty/edge-case request.
await fetch(`${BUILD_TIME_URL}/api/cart`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: SYNTHETIC_USER_ID,
    item: { productId: firstProduct.id, quantity: 1 },
  }),
})

// Known limitation: this places a real (mock) order on every deploy/test
// run, and this demo app has no order-history or delete-order capability
// at all, so there's nothing here to clean up afterward. In a fully
// implemented production application, a check like this would also
// delete/cancel the order it created afterward, to avoid polluting real
// order and revenue data.
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
