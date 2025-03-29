<div class="sci-fi-fade h-120 w-[40vw]">
	<div class="flex items-center justify-center">
		<div
			class="relative h-full w-full overflow-hidden rounded-lg border border-white/20 bg-gray-900"
		>
			<!-- Main Content -->
			<div class="relative flex h-120 w-full flex-col overflow-hidden p-4">
				<!-- Minimal title -->
				<h1 class="w-full p-3 text-center text-3xl font-light tracking-wider text-white">MOSAIC</h1>

				<!-- Description container -->
				<div class="flex h-full items-center justify-center rounded-md border border-white/10 p-6">
					<p class="max-w-md text-center text-lg leading-relaxed text-white/70">
						Mosaic is a collaborative drawing application that allows users to edit a 1000×1000 grid
						of pixels in real-time.
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
