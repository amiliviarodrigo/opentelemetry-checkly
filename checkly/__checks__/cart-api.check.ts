import { ApiCheck, AssertionBuilder } from 'checkly/constructs'
import { BASE_URL } from './env'

// A fixed synthetic session ID is safe here: GetCartAsync explicitly
// returns an empty cart (not an error) for any unseen userId
// (src/cart/src/cartstore/ValkeyCartStore.cs:215-216), so this check
// verifies the Cart service is up and responding correctly, not that a
// specific cart's contents are correct.
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
