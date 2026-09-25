import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { SITE } from '../site/site.config';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeoService);
    document = TestBed.inject(DOCUMENT);
    document.head.querySelector('link[rel="canonical"]')?.remove();
  });

  it('suffixes the page title with the site owner and role', () => {
    service.update({ title: 'About', description: 'desc', path: '/about' });

    expect(TestBed.inject(Title).getTitle()).toBe(`About | ${SITE.name} — ${SITE.role}`);
  });

  it('sets the meta description from the page', () => {
    service.update({ title: 'About', description: 'A description.', path: '/about' });

    expect(TestBed.inject(Meta).getTag('name="description"')?.content).toBe('A description.');
  });

  it('publishes Open Graph tags so shared links unfurl correctly', () => {
    service.update({ title: 'Contact', description: 'Reach out.', path: '/contact' });

    const meta = TestBed.inject(Meta);
    expect(meta.getTag('property="og:title"')?.content).toContain('Contact');
    expect(meta.getTag('property="og:description"')?.content).toBe('Reach out.');
    expect(meta.getTag('property="og:url"')?.content).toBe(`${SITE.baseUrl}/contact`);
    expect(meta.getTag('property="og:type"')?.content).toBe('website');
  });

  it('builds an absolute canonical URL from the route path', () => {
    service.update({ title: 'Demo', description: 'desc', path: '/demo' });

    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe(`${SITE.baseUrl}/demo`);
  });

  it('uses the bare base URL for the root path', () => {
    service.update({ title: 'Home', description: 'desc', path: '/' });

    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe(SITE.baseUrl);
  });

  it('reuses a single canonical element across navigations', () => {
    service.update({ title: 'Home', description: 'desc', path: '/home' });
    service.update({ title: 'About', description: 'desc', path: '/about' });

    const links = document.head.querySelectorAll('link[rel="canonical"]');
    expect(links.length).toBe(1);
    expect(links[0].getAttribute('href')).toBe(`${SITE.baseUrl}/about`);
  });
});
