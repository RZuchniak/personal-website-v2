<script lang="ts">
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
					class="flex h-full items-center justify-center rounded-md border border-white/10 sm:p-4 md:p-6"
				>
					<p
						class="sm:text-clamp(0.25rem,0.5vw,0.5rem) max-w-md text-center text-[1vw] leading-relaxed text-white/70 md:text-lg"
					>
						{projectDescription}
					</p>
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
