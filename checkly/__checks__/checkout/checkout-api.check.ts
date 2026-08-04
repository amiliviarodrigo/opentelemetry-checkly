import { ApiCheck, AssertionBuilder } from 'checkly/constructs'
import { BASE_URL } from '../env'

// Note: this places a real order every run. A production version of this
// check would also delete the order afterward - not possible here, this
// app has no delete-order capability.
new ApiCheck('checkout-api-check', {
  name: 'Checkout API',
  request: {
    method: 'POST',
    url: `${BASE_URL}/api/checkout?currencyCode=USD`,
    bodyType: 'JSON',
    body: '{}',
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.jsonBody('$.orderId').isNotNull(),
    ],
  },
  setupScript: { entrypoint: './checkout-setup.js' },
})
