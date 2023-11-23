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
 * @param {string} sourceFile
 */
const getRouteInDev = (sourceFile) => {
    const regex = new RegExp(
        `^${cwd}/${routesDir}/([a-z\\[\\]/+.-]+)/\\+page\\.server\\.(js|ts)$`,
    );
    const regexResult = regex.exec(sourceFile);
    if (!regexResult || regexResult.length < 2) {
        throw new Error(
            `Invalid route ${sourceFile}\n${JSON.stringify(
                {
                    DEV,
                    cwd,
                    routesDir,
                    outDir,
                },
                null,
                2,
            )}}`,
        );
    }

    return `/${regexResult[1]}`;
};

/**
 * @param {string} sourceFile
 */
const getRouteInBuild = (sourceFile) => {
    console.log(`todo: implement getRouteInBuild for ${sourceFile}`);
    return `/fake-route`;
};

/**
 * Register a route handler.
 *
 * @param {import('@sveltejs/kit').Handle} handler
 */
export const registerHandler = (handler) => {
    const callSite = callsites()[1];

    let route = DEV
        ? getRouteInDev(callSite.getEvalOrigin())
        : getRouteInBuild(callSite.getFileName());

    routeHandlers.set(route, handler);
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
