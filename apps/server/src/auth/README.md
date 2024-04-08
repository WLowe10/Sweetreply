# Auth

This directory contains most of the authentication logic for Invincible. There are a lot of features, however, they are designed to be easily understandable and modular.

### Overview

---

Although JWT authentication seems to be the hot trend, there are issues with invalidating the tokens. That is why Invincible utilizes sessions. The Invincible authentication layer has been designed to be secure and easy to understand.

There are really only 2 parts to the authentication: Users and sessions

Whenever a user signs in, a session is _created_.
Whenever a user signs out, a session is _destroyed_.

### Table of Contents

---

[Users](#users)
[Sessions](#sessions)
[Verification](#verification)
[Password Changing](#password-changing)
[Password Recovery](#password-recovery)
[Usage](#usage)

### Users

---

The **user** is the core piece of authentication. Basically, a **user** has an email and a password. _The password is hashed using Argon2_.

There are two roles: **user** and **admin**. "Users" are clearly, well, users. They are able to use the platform normally. "Admins" on the other hand, are given enhanced powers. See documentation for the admin functionality [here](../admin/README.md)

All users begin as unverified. They must verify their accounts through [email verification](#verification). While they are unverified, they can only perform rudimentary actions.

### Sessions

---

A user can have many sessions at a time. Upon sign-in with valid credentials, a session is created and the user is sent an HTTPOnly, Secure session cookie (sid). **_This cookie must be included in all authenticated requests_**

When an authenticated user requests any endpoint, their session is refreshed, extending the time until the expiration.

If a user makes a request with an expired session, their session cookie is cleared, and they will have to sign in again.

### Verification

---

temp

### Password Changing

---

Whenever a user sucessfully changes their password, all of their **sessions** are destroyed. In the event that someone has access to a user's account without permission, the user can reset their password to log them out and lockdown the acccount.

For an authenticated user, they can request a password reset email

---

### Password Recovery

For unauthenticated users, they can use the **forgot password** functionality. The user will enter their email of their account to request a password reset. If the account exists, they will receive the email, and they can reset their password. _The requester will not be told whether their request was successful or not_

**These functionalities use the same email flow and will only be sent once every 5 minutes**

### Usage

---

#### tRPC

```js
// this procedure only allows requests from authenticated users whose accounts are verified (e.g., get me, sign out)
import { authenticatedProcedure } from "@/trpc";

// this procedure only allows requests from authenticated users whose accounts don't need to be verified
import { authenticatedUnverifiedProcedure } from "@/trpc";

// this procedure only allows requests from unauthenticated users (e.g., sign in)
import { unverifiedProcedure } from "@/trpc";

// here is an example of using authenticatedProcedure
authenticatedProcedure.mutation(({ ctx }) => {
	/* since authenticatedProcedure only allows verified users, ctx.user.verified_at will be a timestamp (the user is verified)
	 */
	// ctx.user -> the user
	// ctx.session -> the session
	// ctx.authService -> the AuthService instance

	return `Hello ${ctx.user.first_name}!`;
});
```

#### Express

```js
import { authService } from "@/auth";

app.get("/test", (req, res) => {
	const result = await authService.validateRequest(req);

	if (!result.success) {
		// handle error

		return res.sendStatus(403)
	}

	// authenticated

	const { session, user } = result.data
})
```
