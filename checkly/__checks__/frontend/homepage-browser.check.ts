import { BrowserCheck } from 'checkly/constructs'

new BrowserCheck('homepage-browser-check', {
  name: 'Homepage',
  code: { entrypoint: './homepage.spec.ts' },
})
