import { ApiCheck, AssertionBuilder } from 'checkly/constructs'
import { BASE_URL } from '../env'

// Shipping cost only depends on item count, not the product or address, so
// a placeholder item is fine here.
const itemList = JSON.stringify([{ productId: 'checkly-synthetic-item', quantity: 1 }])
const address = JSON.stringify({
  streetAddress: 'Unter den Linden 1',
  city: 'Berlin',
  state: 'Berlin',
  country: 'Germany',
  zipCode: '10117',
})

const url = `${BASE_URL}/api/shipping?${new URLSearchParams({
  itemList,
  address,
  currencyCode: 'USD',
}).toString()}`

new ApiCheck('shipping-api-check', {
  name: 'Shipping API',
  request: {
    method: 'GET',
    url,
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.jsonBody('$.units').isNotNull(),
    ],
  },
})
