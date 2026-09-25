/**
 * GitHub Pages serves its own 404 page for any path it has no file for.
 * Prerendering covers the known routes, so this copies the app shell to
 * `404.html` to keep unknown deep links inside the Angular router (which then
 * renders the in-app "page not found" view) instead of GitHub's error page.
 */
import { copyFile } from 'node:fs/promises';
import { join } from 'node:path';

const browserDir = join(process.cwd(), 'dist', 'my-angular-app', 'browser');

await copyFile(join(browserDir, 'index.html'), join(browserDir, '404.html'));
console.log('Created 404.html fallback for GitHub Pages.');
