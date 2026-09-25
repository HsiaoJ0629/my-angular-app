import {
  Capability,
  CaseStudy,
  Education,
  ImpactMetric,
  SkillGroup,
  WorkHistory,
} from './profile.model';

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    category: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Java', 'C#', 'HTML5', 'CSS3 / SASS'],
  },
  {
    category: 'Frontend',
    items: ['Angular', 'Angular Material', 'Bootstrap', 'Responsive Design'],
  },
  {
    category: 'Backend',
    items: ['Spring Boot', 'Node.js', 'Express.js', 'RESTful APIs'],
  },
  {
    category: 'Databases and tools',
    items: ['MySQL', 'PostgreSQL', 'MongoDB', 'TablePlus'],
  },
  {
    category: 'Cloud and DevOps',
    items: ['AWS S3', 'AWS Textract', 'Docker', 'Jenkins', 'Git', 'Bitbucket', 'WildFly'],
  },
  {
    category: 'Security and integrations',
    items: ['MFA (OTP / TOTP)', 'illion BankFeeds', 'SendGrid', 'Google APIs'],
  },
  {
    category: 'AI-assisted development',
    items: ['Claude Code'],
  },
];

export const WORK_HISTORY: readonly WorkHistory[] = [
  {
    company: 'Attvest Finance',
    role: 'Senior Developer',
    startYear: 2022,
    endYear: null,
    achievements: [
      {
        area: 'Technical leadership',
        detail:
          'Set team coding standards and built a Markdown onboarding knowledge base with ' +
          'Claude Code, cutting new-developer ramp-up time by ~50%.',
      },
      {
        area: 'Fintech architecture',
        detail:
          'Designed and maintained full stack systems — a Loan Origination System, CRM and ' +
          'Online Acceptance platform — in Spring Boot and Angular, supporting 1,000+ loan ' +
          'applications a month.',
      },
      {
        area: 'Production reliability',
        detail:
          'Own production incidents end to end, resolving them quickly to keep broker-facing ' +
          'operations running.',
      },
      {
        area: 'Process automation',
        detail:
          'Led automated workflows and AWS Textract OCR for invoice data extraction, cutting ' +
          'manual data entry by ~70% and saving an estimated 20+ hours a month.',
      },
      {
        area: 'Knowledge platform',
        detail:
          'Built a Sales and Client Training Portal from scratch, improving product adoption and ' +
          'reducing client onboarding time by ~30%.',
      },
      {
        area: 'Strategic integrations',
        detail:
          'Architected illion BankFeeds (bank transaction data) and SendGrid (transactional ' +
          'email) integrations, enabling end-to-end digital loan processing.',
      },
      {
        area: 'Security and compliance',
        detail:
          'Implemented MFA (OTP / TOTP) across financial platforms to meet Australian financial ' +
          'security standards.',
      },
    ],
    skills: [
      'TypeScript',
      'JavaScript',
      'Java',
      'HTML5',
      'CSS3 / SASS',
      'Angular',
      'Angular Material',
      'Bootstrap',
      'Responsive Design',
      'Spring Boot',
      'RESTful APIs',
      'MySQL',
      'TablePlus',
      'AWS S3',
      'AWS Textract',
      'Docker',
      'Jenkins',
      'Git',
      'Bitbucket',
      'WildFly',
      'MFA (OTP / TOTP)',
      'illion BankFeeds',
      'SendGrid',
      'Google APIs',
      'Claude Code',
    ],
  },
  {
    company: 'Sterling Systems Pty. Ltd.',
    role: 'Junior Programmer',
    startYear: 2020,
    endYear: 2022,
    achievements: [
      {
        area: 'Legacy modernisation',
        detail:
          'Led the full migration of a legacy Patient Administration System to Angular and ' +
          'Node.js, improving performance and reducing maintenance overhead by ~40%.',
      },
      {
        area: 'Healthcare platforms',
        detail:
          'Developed the Patient Administration System and an Online Booking Platform with a ' +
          'real-time synchronised calendar, scheduling 10+ clinical resources across departments.',
      },
      {
        area: 'Database management',
        detail:
          'Designed and maintained PostgreSQL schemas for sensitive medical records; query ' +
          'optimisations cut average report load time by ~35%.',
      },
      {
        area: 'Client success',
        detail:
          'Ran technical consultations and system demonstrations for stakeholders, and reduced ' +
          'post-launch support tickets through proactive issue resolution.',
      },
    ],
    skills: [
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3 / SASS',
      'Angular',
      'Angular Material',
      'Bootstrap',
      'Responsive Design',
      'Node.js',
      'Express.js',
      'RESTful APIs',
      'PostgreSQL',
      'Git',
    ],
  },
];

export const EDUCATION: readonly Education[] = [
  {
    degree: 'Master of IT (Computer Science)',
    institution: 'Queensland University of Technology (QUT)',
    focusAreas: ['Artificial Intelligence', 'Machine Learning', 'Project Management'],
    coursework:
      'Practical AI systems design and deployment, data-driven decision modelling, and agile ' +
      'project delivery.',
  },
];

export const IMPACT_METRICS: readonly ImpactMetric[] = [
  { value: '1,000+', label: 'Loan applications a month', source: 'Loan origination platform' },
  { value: '~70%', label: 'Less manual data entry', source: 'Invoice OCR automation' },
  { value: '~50%', label: 'Faster developer ramp-up', source: 'Engineering onboarding' },
  { value: '~40%', label: 'Lower maintenance overhead', source: 'Legacy PAS migration' },
];

export const CAPABILITIES: readonly Capability[] = [
  {
    icon: 'account_tree',
    title: 'Full stack product engineering',
    description:
      'End-to-end ownership of Angular front ends and Spring Boot / Node.js services, from ' +
      'schema design to production support.',
  },
  {
    icon: 'verified_user',
    title: 'Secure financial systems',
    description:
      'MFA (OTP / TOTP), open-banking data feeds and transactional messaging for regulated ' +
      'lending platforms.',
  },
  {
    icon: 'bolt',
    title: 'Automation and cloud',
    description:
      'Replacing manual workflows with AWS Textract OCR pipelines, Docker and Jenkins-based ' +
      'delivery.',
  },
  {
    icon: 'groups',
    title: 'Technical leadership',
    description:
      'Coding standards, onboarding documentation and AI-assisted workflows that make a whole ' +
      'team faster.',
  },
];

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    slug: 'loan-origination',
    title: 'Loan origination platform',
    company: 'Attvest Finance',
    icon: 'account_balance',
    summary:
      'A Loan Origination System, CRM and Online Acceptance platform handling 1,000+ ' +
      'applications a month.',
    problem:
      'Brokers and the credit team needed a single, reliable path from application to signed ' +
      'acceptance, across several systems that each held part of the picture.',
    approach: [
      'Designed the services in Java and Spring Boot, with Angular front ends for brokers, ' +
        'internal staff and applicants.',
      'Kept the LOS, CRM and Online Acceptance platform as separate applications with REST ' +
        'contracts between them, so each can be deployed on its own.',
      'Took end-to-end ownership of production incidents on broker-facing flows.',
    ],
    impact: [
      'Supports 1,000+ loan applications a month.',
      'End-to-end digital loan processing once combined with the bank-data and email ' +
        'integrations below.',
    ],
    stack: ['Java', 'Spring Boot', 'Angular', 'MySQL', 'Docker', 'WildFly', 'Jenkins'],
    featured: true,
  },
  {
    slug: 'invoice-ocr',
    title: 'Invoice OCR automation',
    company: 'Attvest Finance',
    icon: 'document_scanner',
    summary:
      'AWS Textract extraction that cut manual invoice data entry by ~70% — 20+ hours saved a ' +
      'month.',
    problem:
      'Invoice details were re-keyed by hand: slow, error-prone work that grew with loan volume.',
    approach: [
      'Stored uploaded invoices in S3 and extracted fields with AWS Textract OCR.',
      'Wrapped extraction in an automated workflow so staff review results instead of typing ' +
        'them.',
    ],
    impact: ['~70% reduction in manual data entry.', 'An estimated 20+ hours saved every month.'],
    stack: ['AWS Textract', 'AWS S3', 'Spring Boot', 'Angular'],
    featured: true,
  },
  {
    slug: 'mfa',
    title: 'Multi-factor authentication',
    company: 'Attvest Finance',
    icon: 'verified_user',
    summary: 'OTP and TOTP second factors across financial platforms, with a live RFC 6238 demo.',
    problem:
      'Financial platforms needed a second authentication factor to meet Australian financial ' +
      'security standards.',
    approach: [
      'Implemented one-time-password (OTP) and time-based (TOTP) second factors across the ' +
        'platforms.',
      'The demo on this site re-implements TOTP from the RFC with no dependencies, including ' +
        'clock-drift tolerance, replay protection and attempt limiting.',
    ],
    impact: ['MFA in place across financial platforms, in line with compliance requirements.'],
    stack: ['Spring Boot', 'Angular', 'TOTP (RFC 6238)', 'HOTP (RFC 4226)'],
    demoRoute: '/mfa-demo',
    featured: true,
  },
  {
    slug: 'integrations',
    title: 'Open-banking and messaging integrations',
    company: 'Attvest Finance',
    icon: 'hub',
    summary: 'illion BankFeeds and SendGrid integrations enabling end-to-end digital lending.',
    problem:
      'Assessing an application needed bank transaction data, and every step needed reliable ' +
      'customer notifications — both previously manual.',
    approach: [
      'Integrated illion BankFeeds to retrieve applicant bank transaction data.',
      'Integrated SendGrid for transactional email across the loan lifecycle.',
    ],
    impact: ['Enabled end-to-end digital loan processing.'],
    stack: ['illion BankFeeds', 'SendGrid', 'Spring Boot', 'RESTful APIs'],
  },
  {
    slug: 'pas-migration',
    title: 'Patient Administration System migration',
    company: 'Sterling Systems',
    icon: 'local_hospital',
    summary:
      'Led a legacy healthcare system onto Angular and Node.js, cutting maintenance overhead by ' +
      '~40%.',
    problem:
      'A Patient Administration System on an outdated architecture was slow and costly to ' +
      'maintain, while holding sensitive medical records.',
    approach: [
      'Led the full migration to an Angular front end and a Node.js / Express.js back end.',
      'Designed PostgreSQL schemas for medical records and optimised the slowest report ' +
        'queries.',
      'Built an Online Booking Platform with a real-time synchronised calendar alongside it.',
    ],
    impact: [
      '~40% reduction in maintenance overhead, with improved performance.',
      '~35% faster average report load time.',
      'Scheduling for 10+ clinical resources across multiple departments.',
    ],
    stack: ['Angular', 'Node.js', 'Express.js', 'PostgreSQL'],
  },
  {
    slug: 'enablement',
    title: 'Engineering and client enablement',
    company: 'Attvest Finance',
    icon: 'school',
    summary:
      'Coding standards, an AI-assisted onboarding knowledge base and a client training portal.',
    problem:
      'New developers took a long time to become productive, and clients needed a better way ' +
      'to learn the products.',
    approach: [
      'Set team coding standards and wrote a Markdown onboarding knowledge base with Claude ' +
        'Code.',
      'Built a Sales and Client Training Portal from scratch.',
    ],
    impact: ['~50% faster new-developer ramp-up.', '~30% shorter client onboarding.'],
    stack: ['Claude Code', 'Markdown', 'Angular', 'Spring Boot'],
  },
];

export const PROFESSIONAL_SUMMARY =
  'Senior Full Stack Developer with 6+ years designing and delivering scalable web ' +
  'applications in fintech and healthcare. Deep expertise in Angular, Spring Boot and Node.js, ' +
  'with a track record in process automation, secure API integrations, production reliability ' +
  'and technical leadership. Experienced in modernising legacy systems and in using ' +
  'AI-assisted development to streamline engineering workflows.';
