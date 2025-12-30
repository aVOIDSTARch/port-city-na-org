# You Are Here - Port City NA

## Table of Contents

- [You Are Here - Port City NA](#you-are-here---port-city-na)
  - [Table of Contents](#table-of-contents)
  - [Current Status](#current-status)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Alignment with Vision](#alignment-with-vision)
  - [Questions](#questions)
  - [Suggestions](#suggestions)

## Current Status

The project is initialized as a fresh SolidStart application. It appears to be a
"Hello World" or template state with basic routing and configuration. There is
no custom business logic, BMLT integration, or specific "Port City" branding
implemented yet.

## Tech Stack

- **Framework:** SolidStart (`@solidjs/start` ^1.1.0)
- **UI Library:** SolidJS (`^1.9.5`)
- **Styling:** TailwindCSS v4 (`^4.0.7`)
- **Bundler/Server:** Vinxi
- **Language:** TypeScript

## Project Structure

The root directory contains the `portcityna-org-app` folder, which holds the
actual source code.

- `src/routes`: File-based routing (standard SolidStart).
- `src/components`: UI components.
- `app.config.ts`: Vite/SolidStart configuration.

## Alignment with Vision

The current state is a blank canvas. It aligns with the "Top-line aesthetics"
goal by choosing a modern, performance-oriented stack (SolidJS + Tailwind), but
lacks all functional requirements (BMLT, Maps, Search, etc.). It does **not**
yet have the `docs/` folder or `tests/` folder required by `start.ai`.

## Questions

(These overlap with `my-understanding.md`)

1. **`api-mapper`**: Where does this live? Is it an NPM package or a service we
   need to consume?
2. **BMLT Endpoint**: What is the URL for the BMLT server we are connecting to?
3. **Deployment**: Where will this be hosted? (Netlify, Vercel, VPS?)

## Suggestions

1. **Install Vitest**: As mandated by `start.ai`, we need to set up a test suite
   immediately.
2. **Install Typedoc**: Required for documentation generation.
3. **Refactor Root**: Move `portcityna-org-app` contents to the root if this
   repo is solely for the app, or clarify if it's a monorepo. Having a nested
   app folder can complicate some tooling if not intended.
4. **Setup ESLint/Prettier**: Enforce code style early.
5. **Create `api` Service Layer**: Abstract the BMLT communication logic into a
   dedicated service/module.
6. **Implement Layouts**: Create the main shell (Header/Footer) with the
   intended accessibility features (ARIA, Skip links).
7. **Theme Setup**: Configure Tailwind v4 token variables for the "Day of week"
   color coding and "Dark mode" aesthetics.
