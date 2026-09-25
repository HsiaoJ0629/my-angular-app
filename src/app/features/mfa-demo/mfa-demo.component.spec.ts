import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { base32Decode } from '../../core/security/base32';
import { CLOCK } from '../../core/security/clock';
import { totp } from '../../core/security/totp';
import { MfaDemoComponent } from './mfa-demo.component';

describe('MfaDemoComponent', () => {
  /** Pinned mid-step so neighbouring codes are unambiguous. */
  const NOW = 1_700_000_015_000;

  let fixture: ComponentFixture<MfaDemoComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MfaDemoComponent],
      providers: [provideNoopAnimations(), { provide: CLOCK, useValue: () => NOW }],
    }).compileComponents();

    fixture = TestBed.createComponent(MfaDemoComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    await waitFor(() => /^\d{6}$/.test(currentCode()));
  });

  /** Web Crypto resolves outside Angular's zone, so poll until the DOM catches up. */
  async function waitFor(condition: () => boolean): Promise<void> {
    for (let attempt = 0; attempt < 50; attempt++) {
      fixture.detectChanges();
      if (condition()) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    throw new Error('Condition not met in time.');
  }

  const text = (selector: string): string =>
    element.querySelector(selector)?.textContent?.trim() ?? '';
  const currentCode = (): string => text('[data-testid="current-code"]');
  const secret = (): Uint8Array => base32Decode(text('[data-testid="secret"]'));
  const result = (): string => text('.result-message');

  function button(label: string): HTMLButtonElement {
    const match = Array.from(element.querySelectorAll('button')).find((candidate) =>
      candidate.textContent?.includes(label),
    );
    if (!match) {
      throw new Error(`No button labelled "${label}".`);
    }
    return match;
  }

  async function submit(): Promise<void> {
    const previous = text('[data-testid="attempts"]');
    button('Verify').click();
    await waitFor(() => text('[data-testid="attempts"]') !== previous);
  }

  it('generates a secret in the browser and shows its current code', async () => {
    expect(currentCode()).toBe(await totp(secret(), NOW));
  });

  it('exposes the secret as an otpauth key URI', () => {
    expect(text('.uri')).toMatch(/^otpauth:\/\/totp\/.+\?secret=[A-Z2-7]+&/);
  });

  it('accepts the current code', async () => {
    button('Use current code').click();
    await submit();

    expect(result()).toContain('matches the current time step');
  });

  it('refuses the same code a second time', async () => {
    button('Use current code').click();
    await submit();
    button('Use current code').click();
    await submit();

    expect(result()).toContain('already been used');
  });

  it('accepts the previous code as clock drift', async () => {
    button('Use previous code').click();
    await submit();

    expect(result()).toContain('previous time step');
  });

  it('counts down wrong attempts before lockout', async () => {
    const input = element.querySelector('input') as HTMLInputElement;
    input.value = currentCode() === '000000' ? '111111' : '000000';
    input.dispatchEvent(new Event('input'));
    await submit();

    expect(result()).toContain('4 attempts left');
  });

  it('switches to 8-digit codes and starts a fresh attempt log', async () => {
    button('Use current code').click();
    await submit();

    button('8 digits').click();
    await waitFor(() => /^\d{8}$/.test(currentCode()));

    expect(currentCode()).toBe(
      await totp(secret(), NOW, { algorithm: 'SHA-1', digits: 8, period: 30 }),
    );
    expect(element.querySelector('[data-testid="attempts"]')).toBeNull();
  });

  it('replaces the secret on request', async () => {
    const before = text('[data-testid="secret"]');
    button('New secret').click();
    fixture.detectChanges();

    expect(text('[data-testid="secret"]')).not.toBe(before);
  });
});
