import callsites from 'callsites';
import { DEV } from 'esm-env';

/** @type string */
const cwd = process.cwd(); // e.g. /workspaces/<project-name>

/** @type {import('@sveltejs/kit').Config} */
const svelteConfig = await import(/* @vite-ignore */ `${cwd}/svelte.config.js`);

/** @type string */
const routesDir = svelteConfig?.kit?.files?.routes || 'src/routes';

/** @type string */
const outDir = svelteConfig?.kit?.outDir || '.svelte-kit';

/** @type Map<string, import('@sveltejs/kit').Handle> */
const routeHandlers = new Map();

/**
 * Register a route handler.
 *
 * @param {import('@sveltejs/kit').Handle} handler
 */
export const registerHandler = (handler) => {
    const callSite = callsites()[1];

    /** @type string | undefined | null */
    let source;
    /** @type RegExp */
    let regex;
    if (DEV) {
        source = callSite.getEvalOrigin(); // e.g. /workspaces/<project-name>/src/routes/sverdle/+page.server.js
        regex = new RegExp(
            `^${cwd}/${routesDir}/([a-z+./-]+)/\\+page\\.server\\.(js|ts)$`,
        );
    } else {
        source = callSite.getFileName(); // e.g. file:///workspaces/<project-name>/.svelte-kit/output/server/entries/pages/sverdle/_page.server.js
        regex = new RegExp(
            `^file://${cwd}/${outDir}/output/server/entries/pages/([a-z+./-]+)/_page\\.server\\.js$`,
        );
    }
    if (!source) {
        throw new Error('Could not get source file for route');
    }

    const regexResult = regex.exec(source);
    if (!regexResult || regexResult.length < 2) {
        throw new Error(
            `Invalid route ${source} ${JSON.stringify({
                DEV,
                cwd,
                routesDir,
                outDir,
            })}}`,
        );
    }

    routeHandlers.set(`/${regexResult[1]}`, handler);
};

/**
 * Call registered route handlers for the current request event.
 *
 * @type {import('@sveltejs/kit').Handle}
 */
export const routerMiddleware = async ({ event, resolve }) => {
    if (!event.route.id) {
        return await resolve(event);
    }

    const routeHandler = routeHandlers.get(event.route.id);
    if (routeHandler) {
        const response = await routeHandler({ event, resolve });
        return response;
    }

    return await resolve(event);
};
