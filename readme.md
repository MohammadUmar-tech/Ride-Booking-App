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
