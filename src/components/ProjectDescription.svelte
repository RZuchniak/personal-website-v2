<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	let {
		projectName = 'Mosaic',
		projectDescription = 'Mosaic is a collaborative drawing application that allows users to edit a 1000×1000 grid of pixels in real-time.'
	}: { projectName?: string; projectDescription?: string } = $props();
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
						<a href="https://google.com" target="blank">
							<svg class="h-10 w-10 text-white/30" viewBox="0 0 97.707 97.707">
								<path
									d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
								/>
							</svg></a
						>
						<svg class="h-10 w-10 text-white/30" viewBox="0 0 97.707 97.707">
							<path
								d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
							/>
						</svg>
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
