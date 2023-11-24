import callsites from 'callsites';
import { BROWSER, DEV } from 'esm-env';
import fs from 'node:fs';

if (BROWSER) {
    throw new Error('SvelteKit route hooks cannot be used in the browser.');
}

/** @type {string} */
const cwd = process.cwd(); // e.g. /workspaces/<project-name>

/** @type {import('@sveltejs/kit').Config} */
const svelteConfig = await import(/* @vite-ignore */ `${cwd}/svelte.config.js`);

/** @type {string} */
const routesDir = svelteConfig?.kit?.files?.routes || 'src/routes';

/** @type {string} */
const outDir = svelteConfig?.kit?.outDir || '.svelte-kit';

/**  @type {import('vite').Manifest} | undefined */
let viteManifest;
if (!DEV) {
    const manifestFile = `${cwd}/${outDir}/output/server/.vite/manifest.json`;
    viteManifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
}

/** @type {Map<string, import('@sveltejs/kit').Handle>} */
const layoutHandlers = new Map();

/** @type {Map<string, import('@sveltejs/kit').Handle>} */
const pageHandlers = new Map();

const routeHandlers = new Map();

/**
 * Get the source path of the currently called file. This is different when run
 * in `dev` versus `build` mode.
 *
 * @returns {string} A path relative to the project root, for example
 * `/launch-codes/[code]/+page.server.js`
 */
const getSourceFile = () => {
    /** @type {import('callsites').CallSite} */
    const callSite = callsites()[2];

    if (DEV) {
        const prefix = `${cwd}/${routesDir}`;
        const file = callSite.getEvalOrigin();
        if (!file) {
            throw new Error('Expected source file');
        }
        if (!file.startsWith(prefix)) {
            throw new Error(`Unexpected source file path ${file}`);
        }

        return file.slice(prefix.length);
    }

    const buildPrefix = `file://${cwd}/${outDir}/output/server/`;
    const buildFile = callSite.getFileName();
    if (!buildFile) {
        throw new Error('Expected build source file');
    }
    if (!buildFile.startsWith(buildPrefix)) {
        throw new Error(`Unexpected build source file path ${buildFile}`);
    }
    if (!viteManifest) {
        throw new Error('Expected Vite manifest file');
    }

    const shortBuildFile = buildFile.slice(buildPrefix.length);
    const manifestChunk = Object.values(viteManifest).find(
        ({ file }) => file == shortBuildFile,
    );
    if (!manifestChunk) {
        throw new Error(`Could not find manifest chunk for ${shortBuildFile}`);
    }

    const prefix = routesDir;
    const file = manifestChunk.src;
    if (!file.startsWith(prefix)) {
        throw new Error(`Unexpected source file path ${file}`);
    }

    return file.slice(prefix.length);
};

/**
 * Register a route handler.
 *
 * @param {import('@sveltejs/kit').Handle} handler
 */
export const registerHandler = (handler) => {
    const sourceFile = getSourceFile();

    const regexResult = /(.*)\/\+(layout|page)\.server\.(js|ts)$/.exec(
        sourceFile,
    );
    if (!regexResult || regexResult.length < 4) {
        throw new Error(`Unexpected source file path ${sourceFile}`);
    }

    const [, routeId, type] = regexResult;
    if (type === 'layout') {
        layoutHandlers.set(routeId, handler);
    } else if (type === 'page') {
        pageHandlers.set(routeId, handler);
    } else {
        throw new Error(`Unexpected source file path ${sourceFile}`);
    }

    console.log(`🤖 Registered ${type} hook: ${routeId}`);
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
