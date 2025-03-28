<div class="sci-fi-fade h-120">
	<div class="flex items-center justify-center bg-black">
		<div
			class="h-full w-full overflow-hidden rounded-lg border shadow-[0_0_15px_rgba(255,255,255,0.3)]"
		>
			<!-- Header -->
			<div class="border-b p-3">
				<!-- ... rest of your header code ... -->
			</div>

			<!-- Textbox -->
			<div class="relative h-120 w-full resize-none bg-black p-4 flex">
				<h class="w-full resize-none bg-black p-3 font-extrabold text-white text-center text-3xl">MOSAIC</h>
                <p></p>
				<!-- ... corner elements ... -->
			</div>
		</div>
	</div>
</div>

<style>
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
			opacity: 0.8;
			filter: brightness(1) saturate(1);
			transform: scale(1);
		}
	}
</style>
