
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'my-angular-app',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/my-angular-app/home",
    "route": "/my-angular-app"
  },
  {
    "renderMode": 2,
    "route": "/my-angular-app/home"
  },
  {
    "renderMode": 2,
    "route": "/my-angular-app/about"
  },
  {
    "renderMode": 2,
    "route": "/my-angular-app/contact"
  },
  {
    "renderMode": 2,
    "route": "/my-angular-app/demo"
  },
  {
    "renderMode": 2,
    "redirectTo": "/my-angular-app/home",
    "route": "/my-angular-app/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 34234, hash: '2a2d7ea0b91f869b79105bf52744746969d3ec77ca9b9266b11bd0ef0c300dc6', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17153, hash: 'cdf7137e1f4d257181f89b750cbb7bb475c987f1fca3783d053f21b7817587bf', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'about/index.html': {size: 76080, hash: 'ccc3790e0b404631c8c373bcedd8d361b52d6e9ec90ed653c6e6c0fdee976baf', text: () => import('./assets-chunks/about_index_html.mjs').then(m => m.default)},
    'home/index.html': {size: 76080, hash: 'ccc3790e0b404631c8c373bcedd8d361b52d6e9ec90ed653c6e6c0fdee976baf', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'contact/index.html': {size: 76080, hash: 'ccc3790e0b404631c8c373bcedd8d361b52d6e9ec90ed653c6e6c0fdee976baf', text: () => import('./assets-chunks/contact_index_html.mjs').then(m => m.default)},
    'demo/index.html': {size: 76080, hash: 'ccc3790e0b404631c8c373bcedd8d361b52d6e9ec90ed653c6e6c0fdee976baf', text: () => import('./assets-chunks/demo_index_html.mjs').then(m => m.default)},
    'styles-Z5BYSOFW.css': {size: 245500, hash: '1RveIblK16g', text: () => import('./assets-chunks/styles-Z5BYSOFW_css.mjs').then(m => m.default)}
  },
};
