import { ApiCheck, AssertionBuilder } from 'checkly/constructs'
import { BASE_URL } from './env'

// Shipping cost is calculated purely from item count
// (src/shipping/src/shipping_service/quote.rs: create_quote_from_count),
// not from which product it is or the address content, so a synthetic
// placeholder item/address is safe here and doesn't depend on any real
// catalog data.
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
