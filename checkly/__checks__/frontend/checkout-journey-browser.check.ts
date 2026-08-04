import { BrowserCheck } from 'checkly/constructs'

new BrowserCheck('checkout-journey-browser-check', {
  name: 'Checkout Journey',
  code: { entrypoint: './checkout-journey.spec.ts' },
})
