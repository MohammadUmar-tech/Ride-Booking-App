# Backend API

## Register a user

Creates a user account.

- **Method:** `POST`
- **URL:** `/api/users/register`
- **Content-Type:** `application/json`

### Request body

```json
{
  "email": "jane@example.com",
  "fullName": {
    "firstName": "Jane",
    "lastName": "Doe"
  },
  "password": "example-password"
}
```

`email` must be a valid email address, `fullName.firstName` must contain at
least 3 characters, and `password` must contain at least 6 characters.
`fullName.lastName` is optional.

### Response format

The endpoint returns JSON. A successful registration returns **201 Created**:

```json
{
  "message": "User created Successfully",
  "user": {
    "_id": "665f1a2b3c4d5e6f78901234",
    "fullName": {
      "firstName": "Jane",
      "lastName": "Doe"
    },
    "email": "jane@example.com",
    "password": "<bcrypt password hash>",
    "createdAt": "2026-10-16T00:00:00.000Z",
    "updatedAt": "2026-10-16T00:00:00.000Z",
    "__v": 0
  },
  "Token": "<JWT token>"
}
```

The response also sets an HTTP-only `token` cookie containing the same JWT.
The cookie expires after 24 hours.

**Security note:** The current registration response serializes the newly
created user document, which can include the hashed `password`, and also
returns the JWT in the JSON body. The schema's `select: false` setting does not
remove the password from a document returned by creation. The password hash
and token should not be exposed in the response body in production; return
only safe user fields and use the HTTP-only cookie for the token.

### Errors

- **400 Bad Request** — Request validation failed. The body contains an
  `errors` array with validation details, for example:

  ```json
  {
    "errors": [
      {
        "type": "field",
        "value": "not-an-email",
        "msg": "Invalid Email",
        "path": "email",
        "location": "body"
      }
    ]
  }
  ```
- **400 Bad Request** — An account with the email already exists:

  ```json
  {
    "message": "User already exist"
  }
  ```

- **404 Not Found** — An error occurs during registration. The current
  controller returns a `message` and an `Error` string, for example:

  ```json
  {
    "message": "Bad Request Error Occur while Regiteration of user",
    "Error": "<error details>"
  }
  ```

## Log in a user

Authenticates an existing user with their email and password.

- **Method:** `POST`
- **URL:** `/api/users/login`
- **Content-Type:** `application/json`

### Request body

```json
{
  "email": "jane@example.com",
  "password": "example-password"
}
```

`email` must be a valid email address and `password` must contain at least 6
characters.

### Response format

Successful login returns **200 OK** with a JSON body:

```json
{
  "message": "User Logged in SuccessFully",
  "Token": "<JWT token>"
}
```

The response also sets an HTTP-only `token` cookie containing the same JWT.
The cookie expires after 24 hours.

### Errors

- **400 Bad Request** — Request validation failed. The body contains an
  `errors` array with validation details.
- **400 Bad Request** — No account exists for the submitted email:

  ```json
  {
    "message": "User not found please Register first"
  }
  ```

- **400 Bad Request** — The password does not match the account:

  ```json
  {
    "message": "Password is Incorrect"
  }
  ```

- **400 Bad Request** — Email or password is missing:

  ```json
  {
    "message": "email and password are Required"
  }
  ```

- **500 Internal Server Error** — An unexpected error occurs. The controller
  returns a `message` and an `error` field:

  ```json
  {
    "message": "Internal server Error",
    "error": "<error details>"
  }
  ```

## Register a captain

Creates a captain account and its vehicle details. The route is mounted under
`/api/captains`.

- **Method:** `POST`
- **URL:** `/api/captains/register`
- **Content-Type:** `application/json`

### Request body

```json
{
  "email": "captain@example.com",
  "fullName": {
    "firstName": "Alex",
    "lastName": "Morgan"
  },
  "password": "example-password",
  "vehicle": {
    "color": "black",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

| Field | Requirements |
| --- | --- |
| `email` | Required; valid email address. Stored in lowercase. |
| `fullName.firstName` | Required; at least 3 characters. |
| `fullName.lastName` | Optional; if supplied, at least 3 characters. |
| `password` | Required; at least 3 characters per route validation. It is hashed with bcrypt before storage. |
| `vehicle.color` | Required; at least 3 characters. |
| `vehicle.plate` | Required; at least 3 characters. |
| `vehicle.capacity` | Required; integer of at least 1. |
| `vehicle.vehicleType` | Required; one of `car`, `motorcycle`, or `auto`. |

The password validator's error text says 6 characters, but its configured
minimum is 3. The API returns **400 Bad Request** with an `errors` array if
route validation fails. For example:

```json
{
  "errors": [
    {
      "type": "field",
      "value": "not-an-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

Example request using `curl`:

```sh
curl -X POST http://localhost:3000/api/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "captain@example.com",
    "fullName": { "firstName": "Alex", "lastName": "Morgan" },
    "password": "example-password",
    "vehicle": {
      "color": "black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }'
```

### Response format

On successful registration, the API returns **200 OK** with a JSON body like:

```json
{
  "message": "Captain Created Successfully",
  "captain": {
    "_id": "<captain id>",
    "fullName": {
      "firstName": "Alex",
      "lastName": "Morgan"
    },
    "email": "captain@example.com",
    "password": "<bcrypt password hash>",
    "status": "inactive",
    "vehicle": {
      "color": "black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "createdAt": "<ISO timestamp>",
    "updatedAt": "<ISO timestamp>",
    "__v": 0
  },
  "token": "<JWT token>"
}
```

The response also sets an HTTP-only `token` cookie containing the JWT
(`maxAge` 24 hours; `secure` is currently `false`). The JWT expires after
24 hours. The captain document is returned directly, so the bcrypt password
hash is included despite the schema's `select: false` setting. The token is
also included in the JSON response. These sensitive values should not be
exposed in response bodies in production. The new captain's `status` defaults
to `inactive`; timestamps and other Mongoose fields are included in the
serialized document.

### Errors

- **400 Bad Request** — Route validation failed. The response contains the
  `errors` array described above.
- **401 Unauthorized** — A captain with that email already exists:

  ```json
  {
    "message": "captain Alredy Exist with this email"
  }
  ```

- **500 Internal Server Error** — An unexpected error occurs, including
  missing required fields or a database error. The controller returns the
  error string in `Error`:

  ```json
  {
    "message": "Internal server Error",
    "Error": "<error details>"
  }
  ```

## Authentication

### How the authentication middleware works

`authenticationMiddleware` protects routes by looking for a JWT in either:

1. The `token` cookie, or
2. The `Authorization` request header using the `Bearer <token>` format.

The cookie is checked first if both are provided. For a candidate token, the
middleware:

1. Checks `blacklistTokenModel` for an exact match. A blacklisted token is
   rejected with **401 Unauthorized**.
2. Verifies the JWT signature and expiration using `JWT_SECRET`.
3. Looks up the user by the `_id` stored in the decoded JWT.
4. Assigns the result to `req.user` and calls `next()` so the route handler can
   use the authenticated user.

Invalid, expired, or blacklisted tokens return **401 Unauthorized**. When
there is no `token` cookie, the middleware reads the `Authorization` header
and removes its `Bearer ` prefix. Currently that header access occurs before
the middleware's `try` block and does not guard against a missing header, so a
request with neither a cookie nor an `Authorization` header may throw instead
of returning the intended **401 Unauthorized**. Send a Bearer token or use
the cookie to authenticate.

The JWT is created during registration and login and expires after one day.
Those responses set it as an HTTP-only `token` cookie. They also currently
include the token in the JSON response body; see the security note under
[registration](#register-a-user).

### Blacklisted tokens and logout

`blacklistTokenModel` stores revoked tokens in MongoDB. Each record contains
the token string and a `createdAt` timestamp. The timestamp has a MongoDB TTL
of 86,400 seconds (24 hours), after which MongoDB removes the record. The
middleware checks this collection before accepting a token, so a logged-out
token is rejected even if its JWT has not expired yet.

The logout endpoint is protected by the same middleware, so the request must
include a valid token:

- **Method:** `GET`
- **URL:** `/api/users/logout`

On logout, the controller clears the `token` cookie and stores the presented
token in the blacklist. A successful request returns **200 OK**:

```json
{
  "message": "User Logged out"
}
```

The token can be read from the cookie or the `Authorization: Bearer <token>`
header. The blacklist is shared across requests through MongoDB, which makes
revocation effective on later authenticated requests.

### Protected user profile

The profile endpoint also requires a valid cookie or Bearer token:

- **Method:** `GET`
- **URL:** `/api/users/profile`

It returns **200 OK** with the user document assigned to `req.user`:

```json
{
  "user": {
    "_id": "<user id>",
    "email": "jane@example.com",
    "fullName": {
      "firstName": "Jane",
      "lastName": "Doe"
    }
  }
}
```

The exact user fields are determined by the Mongoose user document. The
middleware does not explicitly reject a missing database user after verifying
the JWT, so in that case the current profile response may contain `"user":
null`.

### Protected route summary

Both routes below are mounted under `/api/users` and run
`authenticationMiddleware` before their controller:

| Method | Route | Purpose | Successful response |
| --- | --- | --- | --- |
| `GET` | `/api/users/profile` | Return the authenticated user document | **200 OK**, `{ "user": <user document> }` |
| `GET` | `/api/users/logout` | Clear the cookie and revoke the presented token | **200 OK**, `{ "message": "User Logged out" }` |

To authenticate, send the `token` cookie set by registration/login, or include
the issued JWT in the `Authorization` header using the Bearer scheme.
