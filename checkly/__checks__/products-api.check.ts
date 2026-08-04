import { ApiCheck, AssertionBuilder } from 'checkly/constructs'
import { BASE_URL } from './env'

new ApiCheck('products-api-check', {
  name: 'Products API',
  request: {
    method: 'GET',
    url: `${BASE_URL}/api/products`,
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.jsonBody('$.length').greaterThan(0),
    ],
  },
})
