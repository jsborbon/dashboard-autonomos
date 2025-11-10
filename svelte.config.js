import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		vitePreprocess({
			style: {
				css: {
					postcss: join(__dirname, 'postcss.config.cjs')
				}
			}
		})
	],
	extensions: ['.svelte'],

	kit: {
		// https://kit.svelte.dev/docs/adapter-cloudflare#options
		adapter: adapter(),
		prerender: {
			handleMissingId: (details) => {
				if (details.id === '#') return;
				console.warn(details.message);
			}
		}
	}
};

export default config;
