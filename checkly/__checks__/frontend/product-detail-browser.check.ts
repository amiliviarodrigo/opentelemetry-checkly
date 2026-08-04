import { BrowserCheck } from 'checkly/constructs'

new BrowserCheck('product-detail-browser-check', {
  name: 'Product Detail Page',
  code: { entrypoint: './product-detail.spec.ts' },
})
