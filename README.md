# Envlink - SaaS URL Shortener Frontend

This repository contains the frontend for Envlink, a SaaS URL shortening service. It is built with [Nuxt.js](https://nuxt.com/), a powerful framework for creating modern web applications with Vue.js.

## Project Structure

This project follows the standard Nuxt.js directory structure, with some additions for our specific needs. Below is a breakdown of the key directories and their purposes.

### Root Directory

- **`.gitignore`**: Specifies files and directories that Git should ignore.
- **`eslint.config.mjs`**: Configuration for ESLint, used for code linting and maintaining code quality.
- **`LICENSE`**: The project's software license.
- **`nuxt.config.ts`**: The main configuration file for the Nuxt.js application. This file controls modules, build settings, server options, and more.
- **`package.json`**: Defines project metadata, dependencies, and scripts.
- **`package-lock.json`**: Records the exact versions of project dependencies.
- **`tailwind.config.js`**: Configuration file for the Tailwind CSS framework.
- **`tsconfig.json`**: The base TypeScript configuration for the project.

---

### `/assets` - Static Assets

This directory is for unprocessed assets like stylesheets, fonts, or images. In this project, it primarily holds the main CSS file.

- **`css/tailwind.css`**: The entry point for Tailwind CSS styles.

---

### `/client` - Auto-generated API Client

This directory contains the auto-generated TypeScript client used to communicate with the backend API. The client is generated from an OpenAPI specification, ensuring type safety and consistency between the frontend and backend.

- **`schema/`**: Contains the source OpenAPI specification (`openapi.yaml`) and a normalized version.
- **`src/client.generated.ts`**: The main generated client file.
- **`src/generated/`**: Contains all the generated files, including API service classes (`AccountApi.ts`, `SubscriptionsApi.ts`, etc.), models, and documentation.
- **`src/wrap/`**: Contains wrapper functions and configuration for the generated client, providing a more convenient and reactive API for use within the application.

---

### `/components` - Vue Components

This directory contains reusable Vue components that make up the user interface.

- **Examples**: `AddPaymentMethodModal.vue`, `BillingAddressDisplay.vue`, `PlanCard.vue`. These components are used across different pages to provide consistent UI elements for features like payments, billing, and subscriptions.

---

### `/composables` - Composition Functions

This directory contains reusable composition functions (similar to React hooks) that encapsulate and manage stateful logic. This is where much of the application's business logic resides.

- **`useApi.ts`**: A generic composable for making API calls.
- **`useAuthStore.ts`**: Manages authentication state and user information.
- **`useSubscriptionStore.ts`**: Manages subscription-related state.
- **`useBillingAddressApi.ts`**: Provides functions specifically for interacting with the billing address API endpoints.

---

### `/layouts` - Page Layouts

This Nuxt-specific directory defines the layouts for different pages in the application. A layout provides a common structure (e.g., header, footer, sidebar) for a group of pages.

- **`default.vue`**: The default layout for most pages.
- **`authenticated.vue`**: A layout for pages that require a logged-in user.
- **`dashboard.vue`**: The specific layout for the main user dashboard area.

---

### `/middleware` - Route Middleware

Middleware are functions that run before a page or layout is rendered. They are used to implement cross-cutting concerns like authentication and authorization.

- **`auth.global.ts`**: A global middleware that runs on every route change, likely to check the user's authentication status.
- **`require-upgradable.ts`**: A specific middleware to protect routes that are only accessible to users with a certain subscription plan.

---

### `/pages` - Application Routes

This directory is the core of Nuxt's file-based routing. The structure of the files and directories inside `/pages` automatically creates the application's routes.

- **`index.vue`**: The homepage of the application.
- **`login.vue`** & **`register.vue`**: Pages for user authentication.
- **`account/`**: Contains nested routes for user account management, such as `profile.vue` and `payment-methods.vue`.
- **`dashboard/`**: The main application section for authenticated users, with pages for analytics, links, etc.

---

### `/public` - Publicly Served Files

Files in this directory are served at the root of the site and are not processed by the build system. This is suitable for files that must have a specific name or location, like `robots.txt` or `favicon.ico`.

---

### `/types` - TypeScript Definitions

This directory holds global TypeScript type definition files (`.d.ts`). This is useful for declaring types for external modules that don't have them or for defining custom types used throughout the application.