
export default {
  basePath: 'https://HsiaoJ0629.github.io/my-angular-app',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
