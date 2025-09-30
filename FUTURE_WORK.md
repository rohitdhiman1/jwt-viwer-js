# Future Work & Project Enhancements

This document outlines potential security improvements and new features to make the JWT Viewer more robust, secure, and user-friendly, drawing inspiration from best practices and tools like `jwt.io`.

---

## 1. Security Enhancements

While the client-side nature of this application is inherently secure, the following improvements will harden it against common web vulnerabilities.

### 1.1. Prevent Cross-Site Scripting (XSS)

*   **The Risk:** A malicious JWT could contain executable code within its payload (e.g., `{"name": "<script>alert('XSS')</script>"}`). The current `syntaxHighlight` function uses `.innerHTML` to render decoded content, which could execute this malicious code.
*   **The Fix:** Refactor the `syntaxHighlight` function to avoid `.innerHTML`. Instead, build the view by creating DOM elements (`document.createElement`) and setting their content with `.textContent`. This ensures all data from the JWT is treated as plain text, never as executable HTML.

### 1.2. Implement Subresource Integrity (SRI)

*   **The Risk:** The application loads libraries (`jwt-decode`, `jsrsasign`) from a CDN. If the CDN is compromised, a malicious version of these libraries could be served, potentially stealing user tokens and secrets.
*   **The Fix:** Add an `integrity` attribute to all `<script>` tags that load external resources. This attribute contains a cryptographic hash of the expected file. The browser will only execute the script if its content matches the hash, preventing any tampered code from running.

**Example:**
```html
<script src="https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js" 
        integrity="sha256-..." 
        crossorigin="anonymous"></script>
```

---

## 2. Feature Enhancements

These features would bring the JWT Viewer closer to the functionality of `jwt.io` and improve the overall user experience.

### 2.1. Real-Time Decoding

*   **Description:** Instead of requiring a button click, the decoder could update in real-time as the user types into the token field.
*   **Benefit:** Provides instant feedback and a more responsive, modern user experience.

### 2.2. Signature Verification

*   **Description:** Add a "Verify Signature" section in the "Decode" tab. The user could input a secret (for HS256) or a public key (for RS256, etc.), and the app would validate the token's signature.
*   **Benefit:** This is a critical feature of JWTs. Displaying a clear "Signature Verified" or "Invalid Signature" status would be a major improvement.

### 2.3. Algorithm Selection for Encoding

*   **Description:** The "Encode" tab is currently hardcoded to `HS256`. Add a dropdown menu to allow users to select from a range of common algorithms (`RS256`, `ES256`, `PS256`, etc.).
*   **Benefit:** Makes the encoding tool far more versatile and useful for a wider variety of applications. This would also require UI changes to handle public/private key inputs.

### 2.4. Better Error Highlighting

*   **Description:** When a token is invalid, `jwt.io` often highlights the specific part of the token (header, payload, or signature) that is causing the error.
*   **Benefit:** Provides more specific and helpful feedback to the user, making it easier to debug malformed tokens.

### 2.5. "Copy to Clipboard" Buttons

*   **Description:** Add a small "copy" icon or button next to the encoded JWT and the decoded JSON blocks.
*   **Benefit:** A simple but highly effective quality-of-life improvement that saves the user time.
