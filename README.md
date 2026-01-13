# Arthur Hsiao - Full Stack Developer Portfolio

A professional portfolio website showcasing my skills, experience, and projects. Built with Angular 19, Angular Material, and modern web technologies.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.11.

## Features

- **Professional Home Page** with hero section and quick stats
- **About Me** section with professional summary, skills, and work history
- **Interactive Demo** showcasing full-stack development capabilities
- **Contact Page** with email, LinkedIn, and GitHub links
- **Responsive Design** optimized for all devices
- **Server-Side Rendering (SSR)** for better SEO and performance
- **Modern UI/UX** with smooth animations and Material Design

## Important: Update Your Information

Before deploying, make sure to update:

1. **Contact Component** (`src/app/components/contact/contact.component.ts`):
   - Update `linkedInUrl` with your actual LinkedIn profile URL
   - Update `githubUrl` with your actual GitHub profile URL

2. **Personal Information**: Review and update all personal details throughout the application to match your current information.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
