
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://HsiaoJ0629.github.io/my-angular-app/',
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
    'index.csr.html': {size: 34264, hash: '2218654bea74ae5c30608d61c55d8c27e2e5e07cf1539e0e816d16b12154e921', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17183, hash: 'cc2669cb5fbd0207bd8401c85227e102fbb257253734613ed969dfce731e2d65', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'about/index.html': {size: 127765, hash: 'd75e3bd07878af02888323cb99406454528963ebb86644ce4ed620cef79b64bb', text: () => import('./assets-chunks/about_index_html.mjs').then(m => m.default)},
    'home/index.html': {size: 76133, hash: 'f1057c9f2fc25bb0b727fe1054777d8e7d21eac5218d0d22b10002fec8dbd35b', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'contact/index.html': {size: 76435, hash: 'fc3fe3c935cf7a5b6534398f59c26fd4989d884c2d1626dfa8913da2dc367137', text: () => import('./assets-chunks/contact_index_html.mjs').then(m => m.default)},
    'demo/index.html': {size: 173130, hash: '711a860aad843fd3537cb6204a01a2c318e056f08ab5361db214f315906d262d', text: () => import('./assets-chunks/demo_index_html.mjs').then(m => m.default)},
    'styles-Z5BYSOFW.css': {size: 245500, hash: '1RveIblK16g', text: () => import('./assets-chunks/styles-Z5BYSOFW_css.mjs').then(m => m.default)}
  },
};
