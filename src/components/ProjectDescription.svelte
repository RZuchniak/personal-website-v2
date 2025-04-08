<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	let {
		projectName = 'Mosaic',
		projectDescription = 'Mosaic is a collaborative drawing application that allows users to edit a 1000×1000 grid of pixels in real-time.',
		github,
		website
	}: {
		projectName?: string;
		projectDescription?: string;
		github?: string;
		website?: string;
	} = $props();
</script>

<div class="sci-fi-fade flex items-center justify-center sm:h-[55vh] sm:w-[40vw]">
	<div class="flex h-full w-full items-center justify-center">
		<div
			class="relative h-full w-full overflow-hidden rounded-lg border border-white/20 bg-gray-900"
		>
			<!-- Main Content -->
			<div class="relative flex h-full w-full flex-col overflow-hidden sm:p-[4vh] md:p-6">
				<!-- Minimal title -->
				<h1
					class="h-fit w-full text-center font-light tracking-wider text-white sm:p-[1vh] sm:pt-0 sm:text-[1.5vw] md:p-3 md:text-3xl"
				>
					{projectName}
				</h1>

				<!-- Description container -->
				<div
					class="flex h-full flex-col items-center justify-center rounded-md border border-white/10 sm:p-4 md:p-6"
				>
					<p
						class="sm:text-clamp(0.25rem,0.5vw,0.5rem) highlight max-w-md text-center text-[1vw] leading-relaxed text-white/70 md:text-lg"
					>
						{projectDescription}
					</p>
					<div class="flex gap-4">
						{#if github}
							<a href={github} target="blank" aria-label="GitHub link">
								<svg class="h-10 w-10 text-white/30" viewBox="0 0 97.707 97.707">
									<path
										d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
									/>
								</svg></a
							>
						{/if}
						{#if website}
							<a href={website} target="blank" aria-label="Website link">
								<svg class="h-10 w-10" viewBox="0 0 512 512" fill="black">
									<path
										d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M418.275,146h-46.667  c-5.365-22.513-12.324-43.213-20.587-61.514c15.786,8.776,30.449,19.797,43.572,32.921C403.463,126.277,411.367,135.854,418.275,146  z M452,256c0,17.108-2.191,33.877-6.414,50h-64.034c1.601-16.172,2.448-32.887,2.448-50s-0.847-33.828-2.448-50h64.034  C449.809,222.123,452,238.892,452,256z M256,452c-5.2,0-21.048-10.221-36.844-41.813c-6.543-13.087-12.158-27.994-16.752-44.187  h107.191c-4.594,16.192-10.208,31.1-16.752,44.187C277.048,441.779,261.2,452,256,452z M190.813,306  c-1.847-16.247-2.813-33.029-2.813-50s0.966-33.753,2.813-50h130.374c1.847,16.247,2.813,33.029,2.813,50s-0.966,33.753-2.813,50  H190.813z M60,256c0-17.108,2.191-33.877,6.414-50h64.034c-1.601,16.172-2.448,32.887-2.448,50s0.847,33.828,2.448,50H66.414  C62.191,289.877,60,273.108,60,256z M256,60c5.2,0,21.048,10.221,36.844,41.813c6.543,13.087,12.158,27.994,16.752,44.187H202.404  c4.594-16.192,10.208-31.1,16.752-44.187C234.952,70.221,250.8,60,256,60z M160.979,84.486c-8.264,18.301-15.222,39-20.587,61.514  H93.725c6.909-10.146,14.812-19.723,23.682-28.593C130.531,104.283,145.193,93.262,160.979,84.486z M93.725,366h46.667  c5.365,22.513,12.324,43.213,20.587,61.514c-15.786-8.776-30.449-19.797-43.572-32.921C108.537,385.723,100.633,376.146,93.725,366z   M351.021,427.514c8.264-18.301,15.222-39,20.587-61.514h46.667c-6.909,10.146-14.812,19.723-23.682,28.593  C381.469,407.717,366.807,418.738,351.021,427.514z"
									/>
								</svg>
							</a>
						{/if}
					</div>
				</div>

				<!-- Subtle corner elements -->
				<div class="absolute top-2 left-2 h-3 w-3 border-t border-l border-white/30"></div>
				<div class="absolute top-2 right-2 h-3 w-3 border-t border-r border-white/30"></div>
				<div class="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-white/30"></div>
				<div class="absolute right-2 bottom-2 h-3 w-3 border-r border-b border-white/30"></div>

				<!-- Scanline effect -->
				<div
					class="pointer-events-none absolute inset-0"
					style="background: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 100% 4px;
          animation: scanline 15s linear infinite;"
				></div>
			</div>
		</div>
	</div>
</div>

<style>
	a {
		pointer-events: auto;
		cursor: pointer;
	}

	.highlight {
		pointer-events: auto;
		user-select: text;
	}

	@keyframes scanline {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 0 100%;
		}
	}

	/* Your fade-in animation */
	.sci-fi-fade {
		animation: sciFiFade 1s ease-out forwards;
	}

	@keyframes sciFiFade {
		0% {
			opacity: 0;
			filter: brightness(5) saturate(0);
			transform: scale(0.95);
		}
		100% {
			opacity: 1;
			filter: brightness(1) saturate(1);
			transform: scale(1);
		}
	}
</style>
