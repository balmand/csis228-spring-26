# Changes Summary

This document summarizes the main changes currently being made in the project.

## 1. README documentation improvements

The main [README.md](/Users/cbf/dev/edu/csis228-spring-26/README.md) was expanded to make the project easier to understand and easier to demo.

Changes included:

- Correcting the authentication route documentation from `/api/auth/login` to `/api/v1/auth/login`.
- Adding a complex end-to-end API example.
- Showing how authentication, validation, protected routes, and reporting endpoints work together.
- Including runnable `curl` examples for a realistic admin workflow.

### What the new example covers

- Logging in and storing a bearer token.
- Creating a department through a protected route.
- Sending an invalid client payload to show validation behavior.
- Creating a valid client.
- Filtering clients with query string parameters.
- Reading joined client and department data.
- Calling department reporting endpoints.

## 2. Client list filtering support

The client API is being updated so `GET /api/v1/clients` can accept query parameters and filter results.

### Files involved

- [src/controllers/client.controller.js](/Users/cbf/dev/edu/csis228-spring-26/src/controllers/client.controller.js)
- [src/services/client.service.js](/Users/cbf/dev/edu/csis228-spring-26/src/services/client.service.js)
- [src/repositories/client.repository.js](/Users/cbf/dev/edu/csis228-spring-26/src/repositories/client.repository.js)

### Controller change

`ClientController.getAll()` now forwards `req.query` into the service layer instead of always returning the full client list.

Before:

```js
const clients = await ClientService.getAllClients();
```

After:

```js
const clients = await ClientService.getAllClients(req.query);
```

### Service change

`ClientService.getAllClients()` now accepts filters and normalizes them before sending them to the repository.

New behavior:

- Accepts optional `name` and `email` filters.
- Trims whitespace.
- Ignores empty values.
- Keeps filtering logic out of the controller.

The new helper method:

```js
static normalizeFilters(filters = {}) {
    const normalizedFilters = {};

    if (typeof filters.name === "string" && filters.name.trim()) {
        normalizedFilters.name = filters.name.trim();
    }

    if (typeof filters.email === "string" && filters.email.trim()) {
        normalizedFilters.email = filters.email.trim();
    }

    return normalizedFilters;
}
```

### Repository change

`ClientRepository.findAll()` now builds a dynamic SQL query based on optional filters.

New behavior:

- Adds a `WHERE` clause only when filters are present.
- Uses `ILIKE` for case-insensitive matching.
- Uses parameterized SQL values.
- Supports filtering by partial `name` and partial `email`.

This means requests like the following are now supported:

```http
GET /api/v1/clients?name=leila
GET /api/v1/clients?email=@example.com
GET /api/v1/clients?name=lei&email=@example.com
```

## 3. Practical impact

These changes make the project better in two ways:

- The documentation is more useful for teaching, demos, and onboarding.
- The client API is more realistic because users can search/filter results instead of always receiving the full list.

## 4. Current status

At the moment, the tracked in-progress files are:

- [README.md](/Users/cbf/dev/edu/csis228-spring-26/README.md)
- [src/controllers/client.controller.js](/Users/cbf/dev/edu/csis228-spring-26/src/controllers/client.controller.js)
- [src/services/client.service.js](/Users/cbf/dev/edu/csis228-spring-26/src/services/client.service.js)
- [src/repositories/client.repository.js](/Users/cbf/dev/edu/csis228-spring-26/src/repositories/client.repository.js)

This file is meant to act as a focused companion document for those updates.
