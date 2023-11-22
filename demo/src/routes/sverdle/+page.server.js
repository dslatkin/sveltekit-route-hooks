import { error, fail } from '@sveltejs/kit';
import { registerHandler } from 'sveltekit-route-hooks';
import { Game } from './game';

registerHandler(async ({event, resolve}) => {
	console.log('Before route guard');
	if (Math.random() < 0.25) {
		throw error(403, { message: 'You are not authorized' });
	}
	const response = await resolve(event);
	console.log('After route guard');
	return response
});

/** @satisfies {import('./$types').PageServerLoad} */
export const load = ({ cookies }) => {
	const game = new Game(cookies.get('sverdle'));

	return {
		/**
		 * The player's guessed words so far
		 */
		guesses: game.guesses,

		/**
		 * An array of strings like '__x_c' corresponding to the guesses, where 'x' means
		 * an exact match, and 'c' means a close match (right letter, wrong place)
		 */
		answers: game.answers,

		/**
		 * The correct answer, revealed if the game is over
		 */
		answer: game.answers.length >= 6 ? game.answer : null
	};
};

/** @satisfies {import('./$types').Actions} */
export const actions = {
	/**
	 * Modify game state in reaction to a keypress. If client-side JavaScript
	 * is available, this will happen in the browser instead of here
	 */
	update: async ({ request, cookies }) => {
		const game = new Game(cookies.get('sverdle'));

		const data = await request.formData();
		const key = data.get('key');

		const i = game.answers.length;

		if (key === 'backspace') {
			game.guesses[i] = game.guesses[i].slice(0, -1);
		} else {
			game.guesses[i] += key;
		}

		cookies.set('sverdle', game.toString());
	},

	/**
	 * Modify game state in reaction to a guessed word. This logic always runs on
	 * the server, so that people can't cheat by peeking at the JavaScript
	 */
	enter: async ({ request, cookies }) => {
		const game = new Game(cookies.get('sverdle'));

		const data = await request.formData();
		const guess = /** @type {string[]} */ (data.getAll('guess'));

		if (!game.enter(guess)) {
			return fail(400, { badGuess: true });
		}

		cookies.set('sverdle', game.toString());
	},

	restart: async ({ cookies }) => {
		cookies.delete('sverdle');
	}
};
