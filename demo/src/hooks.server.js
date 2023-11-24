import { sequence } from '@sveltejs/kit/hooks';
import { routerMiddleware } from 'sveltekit-route-hooks';

let requestCount = 0;

/** @type {import('@sveltejs/kit').Handle} */
export async function first({ event, resolve }) {
    console.log(`\nRequest #${++requestCount}`);
    console.log(`Route ID: ${event.route.id}`);

    console.log('Before first');
    const response = await resolve(event);
    console.log('After first');
	return response;
}

export const handle = sequence(first, routerMiddleware);
