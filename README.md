# Error Handling and Middleware Guide

This project uses three simple patterns to protect routes and return consistent API errors:

1. Request validation middleware
2. Authentication middleware
3. A shared `handleError` helper

## Files Involved

- [`src/utils/errorHandler.js`](/Users/cbf/dev/csis228-spring-26/src/utils/errorHandler.js)
- [`src/middleware/auth.middleware.js`](/Users/cbf/dev/csis228-spring-26/src/middleware/auth.middleware.js)
- [`src/routes/auth.routes.js`](/Users/cbf/dev/csis228-spring-26/src/routes/auth.routes.js)
- [`src/services/auth.service.js`](/Users/cbf/dev/csis228-spring-26/src/services/auth.service.js)
- [`src/validators/client.validator.js`](/Users/cbf/dev/csis228-spring-26/src/validators/client.validator.js)
- [`src/validators/department.validator.js`](/Users/cbf/dev/csis228-spring-26/src/validators/department.validator.js)
- [`src/routes/client.routes.js`](/Users/cbf/dev/csis228-spring-26/src/routes/client.routes.js)
- [`src/app.js`](/Users/cbf/dev/csis228-spring-26/src/app.js)

## How the Middleware Works

The app first enables JSON request parsing in [`src/app.js`](/Users/cbf/dev/csis228-spring-26/src/app.js#L8):

```js
app.use(express.json());
```

This middleware reads incoming JSON bodies and makes the data available on `req.body`.

## Authentication Flow

Authentication starts with the public login route:

```js
app.use("/api/v1/auth", authRoutes);
```

`POST /api/v1/auth/login` expects:

```json
{
  "username": "admin",
  "password": "password123"
}
```

If the credentials match the configured environment variables, the app returns a bearer token:

```json
{
  "token": "..."
}
```

The protected route groups use the authentication middleware before any controller runs:

```js
router.use(authenticate);
```

The middleware checks the `Authorization` header for this format:

```http
Authorization: Bearer <token>
```

If the header is missing or the token is invalid, the middleware returns `401 Unauthorized`.
If the token is valid, it stores the decoded payload on `req.user` and calls `next()`.

## Environment Variables For Auth

- `AUTH_USERNAME`
- `AUTH_PASSWORD`
- `AUTH_SECRET`
- `AUTH_TOKEN_TTL_SECONDS`

If these are not set, the code currently falls back to:

- username: `admin`
- password: `password123`
- secret: `dev-secret-change-me`
- token lifetime: `3600` seconds

Those defaults are useful for development, but they should be changed in real deployments.

For some routes, there is also validation middleware. In [`src/routes/client.routes.js`](/Users/cbf/dev/csis228-spring-26/src/routes/client.routes.js), the `POST` and `PUT` routes use `createValidator` before the controller runs:

```js
router.post("/", createValidator, ClientController.create);
router.put("/:id", createValidator, ClientController.update);
```

`createValidator` is defined in [`src/validators/client.validator.js`](/Users/cbf/dev/csis228-spring-26/src/validators/client.validator.js). It is an array of middleware functions:

```js
exports.createValidator = [
    body("email").isEmail().normalizeEmail(),
    body("name").trim().notEmpty().withMessage("Name is required"),
    validateRequest,
];
```

### What each step does

- `body("email").isEmail()` checks that `email` is in a valid email format.
- `normalizeEmail()` cleans the email into a standard format.
- `body("name").trim().notEmpty()` removes extra spaces and makes sure `name` is not empty.
- `validateRequest` collects all validation errors.

If validation fails, `validateRequest` stops the request and returns `400 Bad Request`:

```js
return res.status(400).json({ errors: errors.array() });
```

If validation passes, it calls:

```js
next();
```

`next()` tells Express to continue to the next middleware or controller.

The department routes use the same pattern in [`src/validators/department.validator.js`](/Users/cbf/dev/csis228-spring-26/src/validators/department.validator.js), but they validate `name` and `location`.

## How `handleError` Works

The shared helper lives in [`src/utils/errorHandler.js`](/Users/cbf/dev/csis228-spring-26/src/utils/errorHandler.js):

```js
function handleError(res, err) {
    if (err.message?.toLowerCase().includes("not found")) {
        return res.status(404).json({ error: err.message });
    }
    if (err.message?.includes("required")) {
        return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message });
}
```

It checks the text inside `err.message` and maps it to an HTTP status:

- `"not found"` -> `404 Not Found`
- `"required"` -> `400 Bad Request`
- anything else -> `500 Internal Server Error`

This keeps controllers shorter and avoids repeating the same `res.status(...).json(...)` logic.

## Request Flow

For a route like `POST /api/v1/clients`, the flow is:

1. `express.json()` parses the body.
2. `authenticate` checks for a valid bearer token.
3. `createValidator` checks the incoming data.
4. If validation passes, `ClientController.create()` runs.
5. The controller calls the service layer.
6. If the service throws an error, the controller sends it to `handleError`.
7. `handleError` chooses the HTTP status and sends the response.

## Example

If this request is sent with a missing name:

```json
{
  "email": "test@example.com"
}
```

The validator middleware will reject it before the controller runs and return a `400` response with validation details.

If the request is sent without a bearer token, the authentication middleware will stop it first and return:

```json
{
  "error": "Authentication required"
}
```

If validation passes but the service throws:

```js
throw new Error("Client not found");
```

then `handleError` returns:

```json
{
  "error": "Client not found"
}
```

with status `404`.

## Complex Example: Authenticated Admin Workflow

This example walks through a realistic sequence for an admin user:

1. Log in and get a bearer token.
2. Create a new department.
3. Try an invalid client request and observe validation middleware.
4. Create a valid client.
5. Filter clients with query parameters.
6. Read the joined client/department view.
7. Read department reporting endpoints.

Start the server:

```bash
npm start
```

### 1. Log in

```bash
curl -s http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

Expected response:

```json
{
  "token": "eyJ..."
}
```

Save the token in your shell:

```bash
TOKEN="paste-the-token-here"
```

### 2. Create a department

```bash
curl -s http://localhost:3000/api/dep \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research",
    "location": "Beirut"
  }'
```

Example response:

```json
{
  "id": 4,
  "name": "Research",
  "location": "Beirut"
}
```

### 3. Trigger validation on purpose

This request is authenticated, but it fails validation because `name` is empty and `email` is not valid:

```bash
curl -s http://localhost:3000/api/v1/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "not-an-email"
  }'
```

Expected response shape:

```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "path": "email"
    },
    {
      "msg": "Name is required",
      "path": "name"
    }
  ]
}
```

### 4. Create a valid client

```bash
curl -s http://localhost:3000/api/v1/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Leila Haddad",
    "email": "leila.haddad@example.com"
  }'
```

Example response:

```json
{
  "id": 7,
  "name": "Leila Haddad",
  "email": "leila.haddad@example.com"
}
```

### 5. Filter the protected client list

The service layer normalizes query parameters before building the SQL filter:

```bash
curl -s "http://localhost:3000/api/v1/clients?name=leila&email=@example.com" \
  -H "Authorization: Bearer $TOKEN"
```

Example response:

```json
[
  {
    "id": 7,
    "name": "Leila Haddad",
    "email": "leila.haddad@example.com"
  }
]
```

### 6. Read the joined client/department view

This route returns nested department data when the backing database view contains it:

```bash
curl -s http://localhost:3000/api/v1/clients/with-departments \
  -H "Authorization: Bearer $TOKEN"
```

Example response:

```json
[
  {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "department": {
      "id": 2,
      "name": "IT",
      "location": "Tripoli"
    }
  },
  {
    "id": 7,
    "name": "Leila Haddad",
    "email": "leila.haddad@example.com",
    "department": null
  }
]
```

### 7. Read department reporting endpoints

Department/client aggregate function:

```bash
curl -s http://localhost:3000/api/dep/deps-with-emps \
  -H "Authorization: Bearer $TOKEN"
```

Department percentage calculation:

```bash
curl -s http://localhost:3000/api/dep/dep-per \
  -H "Authorization: Bearer $TOKEN"
```

Example response:

```json
{
  "Sales": 33.33333333333333,
  "IT": 50,
  "HR": 16.666666666666664
}
```

### What this example demonstrates

- Public login returns a token.
- Protected routes reject requests without `Authorization: Bearer <token>`.
- Validation middleware can stop bad input before the controller runs.
- Services and repositories support filtered client reads.
- DTO/mappers convert database-shaped rows into API-shaped JSON.
- Reporting routes can return either raw aggregate rows or computed percentages depending on the endpoint.

## Where `handleError` Is Used

`handleError` is used in the controller methods that catch service errors, for example in [`src/controllers/client.controller.js`](/Users/cbf/dev/csis228-spring-26/src/controllers/client.controller.js):

- `getById`
- `create`
- `update`
- `delete`

The department controller follows the same pattern.

## Important Note About the Current Code

Some controller methods still return `500` directly instead of using `handleError`, such as:

- [`src/controllers/client.controller.js`](/Users/cbf/dev/csis228-spring-26/src/controllers/client.controller.js#L5)
- [`src/controllers/client.controller.js`](/Users/cbf/dev/csis228-spring-26/src/controllers/client.controller.js#L50)
- [`src/controllers/department.controller.js`](/Users/cbf/dev/csis228-spring-26/src/controllers/department.controller.js#L5)

That means error handling is only partially centralized right now.

## Summary

This project is a good example of an Express API that layers authentication, validation, controllers, services, repositories, DTOs, and mappers. The complex workflow above shows how those pieces work together in one realistic request sequence.

- Middleware runs before controllers.
- Authentication middleware protects the client and department routes.
- Validation middleware blocks bad input early.
- `next()` passes control forward when validation succeeds.
- `handleError` converts thrown errors into HTTP responses.
- The current app uses a simple message-based strategy for deciding between `400`, `401`, `404`, and `500`.
