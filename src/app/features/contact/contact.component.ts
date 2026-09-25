import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SITE } from '../../core/site/site.config';

/** One way to reach me, rendered as a real link rather than a click handler. */
interface ContactChannel {
  readonly key: string;
  readonly icon: string;
  readonly label: string;
  readonly value: string;
  readonly action: string;
  readonly href: string;
  readonly external: boolean;
}

@Component({
  selector: 'app-contact',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  protected readonly channels: readonly ContactChannel[] = [
    {
      key: 'email',
      icon: 'email',
      label: 'Email',
      value: SITE.email,
      action: 'Send me an email',
      href: `mailto:${SITE.email}?subject=${encodeURIComponent('Portfolio enquiry')}`,
      external: false,
    },
    {
      key: 'linkedin',
      icon: 'work',
      label: 'LinkedIn',
      value: 'Connect with me on LinkedIn',
      action: 'View my professional profile',
      href: SITE.linkedInUrl,
      external: true,
    },
    {
      key: 'github',
      icon: 'code',
      label: 'GitHub',
      value: 'Browse my source code',
      action: 'View my repositories',
      href: SITE.gitHubUrl,
      external: true,
    },
  ];
}
