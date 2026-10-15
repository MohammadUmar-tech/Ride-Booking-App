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
