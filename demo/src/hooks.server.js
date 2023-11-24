import { sequence } from '@sveltejs/kit/hooks';
import { routerMiddleware } from 'sveltekit-route-hooks';

let requestCount = 0;

/** @type {import('@sveltejs/kit').Handle} */
export async function first({ event, resolve }) {
    console.log(`🌎 Request #${++requestCount}: ${event.route.id}`);

    console.log('Before first handler');
    const response = await resolve(event);
    console.log('After first handler');
	return response;
}

export const handle = sequence(first, routerMiddleware);
