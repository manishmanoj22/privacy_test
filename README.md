


✅ What Happens When You "Verify" a JWT
When your backend receives a JWT from the client (e.g. in a cookie), it does not decrypt it using the secret.

Instead, it does:

1. Parse the token
Break it into its 3 parts:

php-template

<base64url-encoded-header>.<base64url-encoded-payload>.<signature>
Example:

Copy
Edit
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiJtYW5pc2hAZXhhbXBsZS5jb20iLCJpYXQiOjE2OTg1NDg4MDAsImV4cCI6MTY5ODYzNTIwMH0.
XHvjA9ti6eW8WZybb_uChKNbiJ8Rtw4UxbLZRHJpLME



HMACSHA256(
    base64UrlEncode(header) + "." + base64UrlEncode(payload),
    secretKey
)
This is how the JWT signature is created using HMAC SHA-256 algorithm.

🔐 Purpose of Signature
To protect the integrity of the token.

Ensures the token wasn't modified by a client or attacker.

Verifiable only by the backend that knows the secretKey.

🔍 Let's explain each part:
1️⃣ base64UrlEncode(header)
This turns the JWT header JSON into a base64 URL-safe string.

Header JSON:
json

{
  "alg": "HS256",
  "typ": "JWT"
}
After base64url encoding:
nginx

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
2️⃣ base64UrlEncode(payload)
This converts the JWT payload JSON into a base64 URL-safe string.

Payload JSON:
json

{
  "sub": "manish@example.com",
  "iat": 1722100000,
  "exp": 1722186400
}
Encoded:
nginx

eyJzdWIiOiJtYW5pc2hAZXhhbXBsZS5jb20iLCJpYXQiOjE3MjIxMDAwMDAsImV4cCI6MTcyMjE4NjQwMH0
3️⃣ Combine them:
text

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiJtYW5pc2hAZXhhbXBsZS5jb20iLCJpYXQiOjE3MjIxMDAwMDAsImV4cCI6MTcyMjE4NjQwMH0
This is the message you will sign.

4️⃣ HMACSHA256(..., secretKey)
Now you sign the above string using:

HMAC: Hash-based Message Authentication Code

SHA-256: Hash function

secretKey: The secret known only to your backend

This generates a fixed-length signature (e.g. 256 bits), like:

nginx

xfLz5ASi3kT8HXJ4g_B8pi_PeF3g9UHOdaGHZSe_53Q
This is appended as the third part of the JWT.

✅ What This Signature Does
If someone modifies the token (like the payload), and sends it back to the server, the backend:

Recalculates the signature using the header+payload and secret.

Compares it with the received signature.

If they don’t match, it rejects the token.

So the signature guarantees integrity — the content is safe only if the secret is safe.


**
🔁 How does decoding (password verification) work if the salt is different every time?**
Here's the key:

The salt is stored inside the bcrypt hash string.

That’s why you don’t need to know or provide the salt manually when verifying a password.

🔐 How BCryptPasswordEncoder works (behind the scenes)
Let’s break it down step-by-step.

Step 1: Registration (encoding password)
java

String hash = encoder.encode("myPassword123");
BCryptPasswordEncoder generates:

a random salt

a hash from salt + password

The final hash looks like this:

shell

$2a$10$CwTycUXWue0Thq9StjUM0uJ8Q5F.Ut9NWRH/yILfZKHkIYT4rZ/aW
🔍 Parts:

$2a$10$ → Algorithm & cost

CwTycUXWue0Thq9StjUM0u → Salt

J8Q5F.Ut9NWRH/yILfZKHkIYT4rZ/aW → Hashed result

💡 So the salt is embedded in the hashed string!

Step 2: Login (verifying password)
java

encoder.matches("myPassword123", storedHash)
What happens:

encoder extracts the salt from storedHash

It rehashes the input password with that extracted salt

It compares the new hash with the stored one

✅ If they match → Password is correct
❌ If not → Wrong password

✅ You never decode the hash
You don’t decrypt or decode a password hash — you hash the input again with the same salt and compare.

