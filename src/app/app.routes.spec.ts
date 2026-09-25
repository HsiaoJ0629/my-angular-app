import { Route } from '@angular/router';
import { routes } from './app.routes';

describe('application routes', () => {
  const featureRoutes = routes.filter((route) => !!route.loadComponent);

  it('lazy-loads every feature so they stay out of the initial bundle', () => {
    routes
      .filter((route) => route.path !== '')
      .forEach((route) => expect(route.loadComponent).withContext(route.path!).toBeDefined());
  });

  it('gives every page a title for the browser tab and search results', () => {
    featureRoutes.forEach((route) => expect(route.title).withContext(route.path!).toBeDefined());
  });

  it('gives every page a meta description', () => {
    featureRoutes.forEach((route) => {
      const data = route.data as { description?: string } | undefined;
      expect(data?.description).withContext(route.path!).toBeTruthy();
    });
  });

  it('redirects the empty path to home', () => {
    const fallback = routes.find((route) => route.path === '');

    expect(fallback?.redirectTo).toBe('home');
    expect(fallback?.pathMatch).toBe('full');
  });

  it('declares the wildcard last so it cannot shadow real routes', () => {
    const wildcardIndex = routes.findIndex((route) => route.path === '**');

    expect(wildcardIndex).toBe(routes.length - 1);
  });

  it('renders a not-found page instead of silently redirecting unknown URLs', () => {
    const wildcard = routes.find((route) => route.path === '**') as Route;

    expect(wildcard.redirectTo).toBeUndefined();
    expect(wildcard.loadComponent).toBeDefined();
  });

  it('exposes each navigable page exactly once', () => {
    const paths = routes.map((route) => route.path);

    expect(new Set(paths).size).toBe(paths.length);
  });
});
