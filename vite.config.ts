import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
	plugins: [tailwindcss(), sveltekit()],
	...(command === 'serve'
		? {
				server: {
					// Dev only: allow ngrok / tunnel host headers (motion APIs need HTTPS URL)
					allowedHosts: true
				}
			}
		: {}),
	ssr: {
		noExternal: ['camera-controls']
	}
}));
