import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  NgZone,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { from, of, switchMap } from 'rxjs';
import { base32Encode } from '../../core/security/base32';
import { CLOCK } from '../../core/security/clock';
import {
  TotpAlgorithm,
  TotpOptions,
  generateSecret,
  hotp,
  otpauthUri,
  secondsRemaining,
  timeStep,
} from '../../core/security/totp';
import {
  DEFAULT_VERIFIER_POLICY,
  TotpVerifier,
  VerificationResult,
} from '../../core/security/totp-verifier';
import { SITE } from '../../core/site/site.config';

const PERIOD_SECONDS = 30;
const ATTEMPT_LOG_SIZE = 5;

/** Codes for the neighbouring time steps, shown so drift tolerance can be tried. */
interface CodeWindow {
  readonly previous: string;
  readonly current: string;
  readonly next: string;
}

interface AttemptLogEntry {
  readonly id: number;
  readonly code: string;
  readonly message: string;
  readonly accepted: boolean;
}

@Component({
  selector: 'app-mfa-demo',
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  templateUrl: './mfa-demo.component.html',
  styleUrl: './mfa-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MfaDemoComponent {
  private readonly clock = inject(CLOCK);

  protected readonly algorithms: readonly TotpAlgorithm[] = ['SHA-1', 'SHA-256', 'SHA-512'];
  protected readonly digitOptions: readonly number[] = [6, 8];
  protected readonly policy = DEFAULT_VERIFIER_POLICY;
  protected readonly sourceUrl = `${SITE.repoUrl}/tree/master/src/app/core/security`;

  protected readonly algorithm = signal<TotpAlgorithm>('SHA-1');
  protected readonly digits = signal(6);
  /** Generated in the browser only, so a prerendered page never ships a secret. */
  protected readonly secret = signal<Uint8Array | null>(null);
  protected readonly now = signal(0);

  protected readonly codeInput = signal('');
  protected readonly result = signal<VerificationResult | null>(null);
  protected readonly attempts = signal<readonly AttemptLogEntry[]>([]);
  protected readonly isVerifying = signal(false);
  private attemptId = 0;

  protected readonly options = computed<TotpOptions>(() => ({
    algorithm: this.algorithm(),
    digits: this.digits(),
    period: PERIOD_SECONDS,
  }));

  protected readonly secretBase32 = computed(() => {
    const secret = this.secret();
    return secret ? base32Encode(secret) : '';
  });

  /** Grouped in fours, the way authenticator apps display keys for manual entry. */
  protected readonly formattedSecret = computed(
    () =>
      this.secretBase32()
        .match(/.{1,4}/g)
        ?.join(' ') ?? '',
  );

  protected readonly keyUri = computed(() =>
    otpauthUri(this.secretBase32(), 'demo@portfolio', SITE.name, this.options()),
  );

  protected readonly secondsLeft = computed(() => secondsRemaining(this.now(), PERIOD_SECONDS));
  protected readonly progress = computed(() => (this.secondsLeft() / PERIOD_SECONDS) * 100);

  /** Changes once per time step, so codes are only recomputed when they change. */
  private readonly codeKey = computed(
    () => ({
      secret: this.secret(),
      options: this.options(),
      step: timeStep(this.now(), PERIOD_SECONDS),
    }),
    {
      equal: (a, b) => a.secret === b.secret && a.options === b.options && a.step === b.step,
    },
  );

  protected readonly codes = toSignal(
    toObservable(this.codeKey).pipe(
      switchMap(({ secret, options, step }) =>
        secret && this.now() > 0
          ? from(this.codeWindow(secret, options, step))
          : of<CodeWindow | null>(null),
      ),
    ),
    { initialValue: null },
  );

  /** A fresh verifier, and so fresh replay and lockout state, per secret and settings. */
  private readonly verifier = computed(() => {
    const secret = this.secret();
    return secret ? new TotpVerifier(secret, this.options()) : null;
  });

  constructor() {
    const zone = inject(NgZone);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.newSecret();
      this.tick();
      // Outside the zone so a one-second interval never holds the app "unstable";
      // signal writes still schedule change detection.
      const id = zone.runOutsideAngular(() => setInterval(() => this.tick(), 1000));
      destroyRef.onDestroy(() => clearInterval(id));
    });
  }

  protected newSecret(): void {
    this.secret.set(generateSecret());
    this.resetVerification();
  }

  protected setAlgorithm(algorithm: TotpAlgorithm): void {
    this.algorithm.set(algorithm);
    this.resetVerification();
  }

  protected setDigits(digits: number): void {
    this.digits.set(digits);
    this.resetVerification();
  }

  protected useCode(code: string): void {
    this.codeInput.set(code);
  }

  protected async verify(): Promise<void> {
    const verifier = this.verifier();
    if (!verifier || this.isVerifying()) {
      return;
    }

    const code = this.codeInput().trim();
    this.isVerifying.set(true);
    try {
      const result = await verifier.verify(code, this.clock());
      this.result.set(result);
      this.attempts.update((log) =>
        [
          {
            id: ++this.attemptId,
            code: code || '(empty)',
            message: this.describe(result),
            accepted: result.status === 'accepted',
          },
          ...log,
        ].slice(0, ATTEMPT_LOG_SIZE),
      );
      if (result.status === 'accepted') {
        this.codeInput.set('');
      }
    } finally {
      this.isVerifying.set(false);
    }
  }

  protected describe(result: VerificationResult): string {
    switch (result.status) {
      case 'accepted':
        if (result.drift === 0) {
          return 'Accepted: the code matches the current time step.';
        }
        return `Accepted: the code was from the ${result.drift < 0 ? 'previous' : 'next'} time step, inside the clock-drift window.`;
      case 'rejected':
        return `Incorrect code. ${result.attemptsRemaining} attempt${result.attemptsRemaining === 1 ? '' : 's'} left before lockout.`;
      case 'replayed':
        return 'Rejected: this code has already been used. Wait for the next one.';
      case 'locked':
        return `Too many failed attempts. Locked for ${result.retryAfterSeconds} s.`;
      case 'malformed':
        return `Enter a ${this.digits()}-digit code.`;
    }
  }

  private tick(): void {
    this.now.set(this.clock());
  }

  private resetVerification(): void {
    this.codeInput.set('');
    this.result.set(null);
    this.attempts.set([]);
  }

  private async codeWindow(
    secret: Uint8Array,
    options: TotpOptions,
    step: number,
  ): Promise<CodeWindow> {
    const [previous, current, next] = await Promise.all(
      [step - 1, step, step + 1].map((counter) =>
        hotp(secret, counter, options.digits, options.algorithm),
      ),
    );
    return { previous, current, next };
  }
}
