import { ApiCheck, AssertionBuilder } from 'checkly/constructs'
import { BASE_URL } from '../env'

new ApiCheck('currency-api-check', {
  name: 'Currency API',
  request: {
    method: 'GET',
    url: `${BASE_URL}/api/currency`,
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.jsonBody('$.length').greaterThan(0),
    ],
  },
})
