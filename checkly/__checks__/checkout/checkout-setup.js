// Runs fresh on every check execution (unlike build-time code), because
// checkout empties the cart on success - it needs a real item added right
// before each run, not just once when the check was deployed.
const axios = require('axios')

const BASE_URL = new URL(request.url).origin
const USER_ID = 'checkly-synthetic-monitoring'

const { data: products } = await axios.get(`${BASE_URL}/api/products`)
const firstProduct = products[0]
if (!firstProduct) {
  throw new Error('There are no products to checkout')
}

await axios.post(`${BASE_URL}/api/cart`, {
  userId: USER_ID,
  item: { productId: firstProduct.id, quantity: 1 },
})

request.body = JSON.stringify({
  userId: USER_ID,
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
})
