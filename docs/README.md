# Envlink API Documentation

This document provides a detailed overview of the Envlink API, a URL shortening service built with NestJS. The API allows for link generation, management, and tracking.

## Base URL

The API is versioned and all endpoints are prefixed with `/api/v1`.

- **Local Development:** `http://localhost:3000`
- **Staging:** `https://staging.enlink.app`
- **Production:** `https://api.envlink.one`

## Authentication

Most API routes require authentication using JSON Web Tokens (JWT). The token must be included in the `Authorization` header of your requests using the `Bearer` scheme.

**Example:** `Authorization: Bearer <your_access_token>`

There are two types of tokens:

-   `jwt-access`: A standard access token for most authenticated requests.
-   `jwt-refresh`: A refresh token used specifically to obtain a new access token from the `/api/v1/auth/refresh` endpoint.

## API Endpoints

The available endpoints are grouped by functionality.

---

### Authentication

Handles user registration, login, and session management.

-   **POST** `/api/v1/auth/register`
    -   **Description:** Registers a new user account.
    -   **Request Body:** `RegisterBodyDto`
-   **POST** `/api/v1/auth/login`
    -   **Description:** Authenticates a user and returns JWT tokens.
    -   **Request Body:** `LoginBodyDto` (Implicitly requires email/password)
-   **POST** `/api/v1/auth/refresh`
    -   **Description:** Refreshes an expired access token using a refresh token.
    -   **Security:** `jwt-refresh`
-   **GET** `/api/v1/auth/verify`
    -   **Description:** Verifies a user's email address using a token sent to them.
    -   **Query Parameter:** `token` (string)

---

### Account

Endpoints for managing the authenticated user's account.

-   **POST** `/api/v1/account/logout`
    -   **Description:** Logs the user out.
    -   **Security:** `jwt-access`
-   **POST** `/api/v1/account/verify/resend`
    -   **Description:** Resends the verification email.
    -   **Security:** `jwt-access`
-   **POST** `/api/v1/account/change-password`
    -   **Description:** Allows a user to change their password.
    -   **Request Body:** `ChangePasswordDto`
    -   **Security:** `jwt-access`

---

### User Management

Endpoints for fetching and updating user information.

-   **GET** `/api/v1/user/me`
    -   **Description:** Retrieves the profile information of the currently authenticated user.
    -   **Security:** `jwt-access`
-   **PUT** `/api/v1/user/update/{id}`
    -   **Description:** Updates a user's information.
    -   **Path Parameter:** `id` (string)
    -   **Request Body:** `UpdateUserBodyDto`
    -   **Security:** `jwt-access`
-   **POST** `/api/v1/user/image/upload`
    -   **Description:** Uploads a user's avatar image.
    -   **Request Body:** `multipart/form-data` with a `file` field.
    -   **Security:** `jwt-access`

---

### URL Management (Transactions)

Endpoints for creating, retrieving, and managing shortened URLs for authenticated users.

-   **POST** `/api/v1/urls`
    -   **Description:** Creates a new short URL.
    -   **Request Body:** `ShortenUrlDto`
    -   **Security:** `jwt-access`
-   **GET** `/api/v1/urls`
    -   **Description:** Retrieves all short URLs for the user.
    -   **Security:** `jwt-access`
-   **GET** `/api/v1/urls/{id}`
    -   **Description:** Retrieves a specific short URL by its ID.
    -   **Path Parameter:** `id` (string)
    -   **Security:** `jwt-access`
-   **PUT** `/api/v1/urls/{id}`
    -   **Description:** Updates a short URL.
    -   **Path Parameter:** `id` (string)
    -   **Request Body:** `UpdateUrlDto`
    -   **Security:** `jwt-access`
-   **DELETE** `/api/v1/urls/{id}`
    -   **Description:** Deletes a short URL.
    -   **Path Parameter:** `id` (string)
    -   **Security:** `jwt-access`

---

### Public URLs

Endpoints for creating and accessing public (anonymous) short URLs.

-   **POST** `/api/v1/public/urls/shorten`
    -   **Description:** Creates a new public short URL.
    -   **Request Body:** `ShortenUrlDto`
-   **GET** `/api/v1/public/urls/{code}`
    -   **Description:** Retrieves a public short URL by its code.
    -   **Path Parameter:** `code` (string)
-   **POST** `/api/v1/public/urls/unlock/{code}`
    -   **Description:** Unlocks a password-protected short URL.
    -   **Path Parameter:** `code` (string)
    -   **Request Body:** `UnlockUrlDto`

---

### Sessions

Endpoints for managing user sessions across different devices.

-   **GET** `/api/v1/session`
    -   **Description:** Retrieves all active user sessions.
    -   **Query Parameter:** `isActive` (boolean)
    -   **Security:** `jwt-access`
-   **GET** `/api/v1/session/{id}`
    -   **Description:** Retrieves a specific session by its ID.
    -   **Path Parameter:** `id` (string)
    -   **Security:** `jwt-access`
-   **POST** `/api/v1/session/revoke`
    -   **Description:** Revokes all of the user's sessions.
    -   **Security:** `jwt-access`
-   **POST** `/api/v1/session/revoke/{id}`
    -   **Description:** Revokes a specific user session by its ID.
    -   **Path Parameter:** `id` (string)
    -   **Security:** `jwt-access`

---

### Subscriptions

Endpoints for managing user subscription plans.

-   **GET** `/api/v1/subscriptions/active`
    -   **Description:** Retrieves the user's active subscription.
    -   **Security:** `jwt-access`
-   **POST** `/api/v1/subscriptions/{id}/deactivate`
    -   **Description:** Deactivates a subscription plan.
    -   **Path Parameter:** `id` (string)
    -   **Security:** `jwt-access`
-   **POST** `/api/v1/subscriptions/{id}/plans/upgrade`
    -   **Description:** Upgrades a subscription plan.
    -   **Path Parameter:** `id` (string)
    -   **Request Body:** `UpgradeSubscriptionDto`
    -   **Security:** `jwt-access`

---

### Health Check

-   **GET** `/api/v1/health`
    -   **Description:** Checks the health status of the API and its dependencies (e.g., database).
