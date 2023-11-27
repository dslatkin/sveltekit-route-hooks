<p align="center">
<img src=".github/logo.svg" height="300" alt="SvelteKit Route Hooks">
</p>

This library makes it easy to create hooks that are scoped to specific routes
right where you expect them: in your routing tree. No more need for string
pattern matching in your hook files when guarding routes!

## Getting started

First, install the library:

```sh
npm install --save-dev sveltekit-route-hooks
```

Next, configure your project hooks to use the handlers:

```js
// src/hooks.server.js
export { handle } from 'sveltekit-route-hooks';
```

Finally, use exported helpers to create hooks scoped to routes. Primitive
authentication that runs on every request and then guards an admin route
might look like:

```js
// src/routes/+layout.server.js
import { handleRoute } from 'sveltekit-route-hooks';
import { db } from '$lib/db';

handleRoute(async function ({ event, resolve }) {
    const sessionId = event.cookies.get('session');
    const user = await db.getUserInfo({ sessionId });
    event.locals = {
        ...event.locals,
        user,
    };
    return await resolve(event);
});

// src/routes/admin/+layout.server.js
import { error } from '@sveltejs/kit';
import { handleRoute } from 'sveltekit-route-hooks';

handleRoute(async function ({ event, resolve }) {
    if (!event.locals?.user?.isAdmin) {
        throw error(403, 'Forbidden');
    }

    return await resolve(event);
});
```
