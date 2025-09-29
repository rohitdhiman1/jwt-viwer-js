# JWT Viewer (Static JS)

A simple, static JavaScript-based JWT (JSON Web Token) viewer. This project allows you to decode and inspect JWTs directly in your browser. It's a client-side only application, making it fast, secure, and easy to host on static platforms like Cloudflare Pages or GitHub Pages.

This project is a JavaScript recreation of the original Spring Boot [JWT Viewer](https://github.com/rohitdhiman1/jwt-viewer).

## How to Use

1.  Open `index.html` in your web browser.
2.  Paste your JWT into the text area.
3.  Select whether the token is "Signed" or "Unsigned".
4.  Click the "Decode" button.
5.  The decoded header and payload will be displayed.

## Sample Tokens for Testing

### Sample Signed JWT

This token is signed with the HS256 algorithm and the secret `secret`.

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Decoded Payload:**
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

### Sample Unsigned JWT

This token has no signature.

```
eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
```

**Decoded Payload:**
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```
