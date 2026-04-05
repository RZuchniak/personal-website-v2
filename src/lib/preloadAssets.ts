const PROJECT_GIFS = [
	'gifs/pace.gif',
	'gifs/mosaic.gif',
	'gifs/mound.gif',
	'gifs/renderer.gif'
] as const;

const PLANET_TEXTURES = ['./neptune.jpg', './jupiter.jpg', './mars.jpg', './makemake.jpg'] as const;

const STATIC_IMAGES = ['click.png'] as const;

/**
 * Warm the browser cache as soon as the 3D scene mounts so the first planet
 * interaction is less likely to stall on network + image decode.
 */
export function preloadProjectMedia(): void {
	for (const url of PLANET_TEXTURES) {
		void fetch(url).catch(() => {});
	}
	for (const src of [...PROJECT_GIFS, ...STATIC_IMAGES]) {
		const img = new Image();
		img.src = src;
		void img.decode?.().catch(() => {
			/* decode may fail for some formats; cache still helps */
		});
	}
}
