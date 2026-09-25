# Arthur Hsiao — Developer Portfolio

A server-side rendered Angular 19 portfolio site, built as a working sample of how I structure, test and ship front-end code.

**Live site:** https://hsiaoj0629.github.io/my-angular-app/home

---

## Contents

- [What's here](#whats-here)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Engineering decisions](#engineering-decisions)
- [Quality gates](#quality-gates)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Deployment](#deployment)

---

## What's here

| Page         | What it demonstrates                                                                      |
| ------------ | ----------------------------------------------------------------------------------------- |
| **Home**     | Impact metrics, featured case studies and the stack this site is built on                 |
| **About**    | Summary, skills, work history and education, cross-linked by an interactive skill filter  |
| **Projects** | Case studies written as problem → approach → impact, deep-linkable per project            |
| **Demo**     | A product management screen: server-side search, sorting, pagination and CRUD             |
| **MFA demo** | A dependency-free TOTP implementation with drift tolerance, replay protection and lockout |
| **Contact**  | Email, LinkedIn and GitHub, as crawlable links rather than script handlers                |

The **About** page links its two panels together: selecting a skill expands the roles where it was used, and flashes the card when a skill spans every role.

The **MFA demo** implements HOTP (RFC 4226) and TOTP (RFC 6238) on the Web Crypto API with no libraries, and runs both the authenticator and the server-side verifier in the browser. It is tested against every RFC test vector.

The **Demo** page talks to the public [DummyJSON](https://dummyjson.com) API. Search is debounced, in-flight requests are cancelled when the query changes, and failures surface as a retryable message instead of a spinner that never stops.

---

## Tech stack

- **Angular 19** — standalone components, signals, built-in control flow
- **Angular Material 19** and **Angular CDK**
- **Angular SSR** — prerendered to static HTML for GitHub Pages
- **RxJS** for the asynchronous data pipeline
- **Karma + Jasmine**, using Angular Material component harnesses
- **ESLint** (`angular-eslint`, including template accessibility rules) and **Prettier**
- **GitHub Actions** for CI and deployment

---

## Architecture

```
src/app/
├── core/                  # Cross-cutting concerns, no UI
│   ├── notifications/     # Toast wrapper, so features don't depend on the toast library
│   ├── products/          # Typed HTTP access for the demo API
│   ├── security/          # HOTP/TOTP, base32 and the TOTP verifier — pure, framework-free
│   ├── seo/               # Per-page metadata, applied through a router TitleStrategy
│   └── site/              # Profile content and site config as typed data
├── features/              # One folder per route, each lazy-loaded
│   ├── about/             #   + summary, skills and history sub-components
│   ├── contact/
│   ├── demo/              #   + product edit dialog
│   ├── home/
│   ├── mfa-demo/
│   ├── not-found/
│   └── projects/
└── layout/                # App shell: header and navigation drawer
```

Three rules keep this navigable:

1. **`core/` never imports from `features/`.** Dependencies point inward.
2. **Content is data, not markup.** Skills, work history, case studies and contact details live in [`core/site/`](src/app/core/site/) as typed constants. Updating a job title or a profile link is a one-line change in one file, not a hunt through templates.
3. **Every route is lazy-loaded.** Only the shell and the landing page are in the initial bundle.

---

## Engineering decisions

A few choices worth explaining, since they are the parts a reviewer would reasonably question.

### Sorting, searching and paging happen on the server

The table asks the API for exactly the page it needs, with `sortBy` and `order` included. Sorting client-side would only reorder the ten rows currently loaded while presenting itself as sorting the whole catalogue — correct-looking output for the wrong result set.

### One reactive pipeline, not a scattering of loading flags

The demo screen derives its request from signals (`search`, `pageIndex`, `pageSize`, `sort`) and pipes it through `switchMap`:

```ts
toObservable(this.request).pipe(
  distinctUntilChanged(sameRequest),
  tap(() => this.isLoading.set(true)),
  switchMap((request) => this.productsService.getProducts(request).pipe(catchError(...))),
  tap(() => this.isLoading.set(false)),
);
```

`switchMap` cancels any request still in flight, so a slow response to an old query can never overwrite a newer one — the race condition you get from firing an independent subscription per keystroke. `catchError` sits on the inner observable so one failure doesn't terminate the outer stream and permanently break the screen.

### TOTP: the verifier is where the security is

Generating a code is a dozen lines. The interesting decisions are in [`TotpVerifier`](src/app/core/security/totp-verifier.ts):

- **Clock drift.** Codes from one step either side are accepted, and the result reports which step matched.
- **Replay protection.** The last accepted step is remembered, so a code — or any older one — cannot be used twice. The check-and-set happens synchronously after the only `await`, so two concurrent submissions of the same code cannot both succeed; a test covers exactly that.
- **Brute force.** A 6-digit code has 10^6 values, so five consecutive failures lock verification for 30 seconds.
- **Timing.** Every window is computed and compared in constant time, so response time does not reveal how close a guess was.
- **64-bit counters.** JavaScript bitwise operators are 32-bit, so the counter is written as two 32-bit words. Tests include counters above 2^32, which a shift-based encoding would silently truncate.

The time source is an injection token, so the RFC vectors and the verifier are tested at fixed instants rather than against the wall clock. The secret is generated only in the browser, so a prerendered page never ships one.

### Metadata lives in the router, not in components

A custom [`TitleStrategy`](src/app/core/seo/seo-title.strategy.ts) reads `title` and `data.description` from the active route and sets the document title, meta description, canonical link and Open Graph tags. Because the site is prerendered, those tags are present in the served HTML rather than applied after hydration, so crawlers and link previews actually see them.

### No second design system

The site previously loaded all of Bootstrap alongside Angular Material — roughly 245 kB of CSS for eleven layout utility classes, plus a set of deprecated Sass `@import` rules. Those eleven classes are now defined in [`src/styles/_layout-utilities.scss`](src/styles/_layout-utilities.scss).

### Responsive behaviour belongs in CSS

Layout that changes with viewport width is handled with media queries rather than by subscribing to `BreakpointObserver` and branching in a template. Both variants stay in the DOM for crawlers and screen readers, and there is no subscription to leak.

---

## Quality gates

Every push and pull request runs formatting, linting, tests and a production build. The deploy workflow re-runs lint and tests, so the site only publishes if they pass.

- **172 unit tests**, ~92% statement coverage, with thresholds enforced in [`karma.conf.js`](karma.conf.js) so coverage cannot quietly regress.
- Tests target **behaviour, not internals** — they drive the rendered DOM and Angular Material's component harnesses, and assert on what a user would observe.
- `HttpTestingController` covers URL construction, parameter encoding and error mapping; the TOTP specs assert the published RFC test vectors.
- Lint includes the **`@angular-eslint` template accessibility** rules, so missing labels and non-interactive click handlers fail the build.
- Bundle budgets sit just above current size, so a regression is a build failure rather than something noticed months later.

### Accessibility

A keyboard-reachable skip link, a real `<main>` landmark, `aria-current` on the active nav item, navigation and contact details as genuine anchors, keyboard-operable table rows, and a global `prefers-reduced-motion` rule that disables the entrance animations.

---

## Getting started

Requires Node.js 20 or later.

```bash
npm install
npm start          # http://localhost:4200/
```

## Scripts

| Script                  | Purpose                                       |
| ----------------------- | --------------------------------------------- |
| `npm start`             | Development server with hot reload            |
| `npm test`              | Unit tests in watch mode                      |
| `npm run test:ci`       | Single headless run with coverage             |
| `npm run lint`          | ESLint over TypeScript and templates          |
| `npm run format`        | Apply Prettier formatting                     |
| `npm run build`         | Production build with SSR                     |
| `npm run build:ghpages` | Static prerendered build for GitHub Pages     |
| `npm run serve:ssr`     | Run the SSR server against a production build |

## Deployment

`npm run build:ghpages` prerenders every route to static HTML and copies the app shell to `404.html`, so deep links GitHub Pages has no file for stay inside the Angular router and render the in-app not-found page.

Pushing to `master` deploys automatically via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

---

## Contact

- **Email:** arthur.hsiao0629@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/arthur-hsiao-2874bb172/
- **GitHub:** https://github.com/hsiaoj0629
