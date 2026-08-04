import { BrowserCheck } from 'checkly/constructs'

new BrowserCheck('cart-browser-check', {
  name: 'Cart Page',
  code: { entrypoint: './cart.spec.ts' },
})
