<div class="sci-fi-fade">
	<div class="flex items-center justify-center bg-black p-4">
		<div
			class="w-full max-w-md overflow-hidden rounded-lg border border-gray-800 bg-gray-900/90 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
		>
			<!-- Header -->
			<div class="border-b border-gray-700 bg-gray-800 p-3">
				<!-- ... rest of your header code ... -->
			</div>

			<!-- Textbox -->
			<div class="relative p-4">
				<textarea
					class="h-40 w-full resize-none border border-gray-700 bg-black p-3 font-mono text-green-400 caret-[#0ff0fc] shadow-[inset_0_0_10px_rgba(0,255,255,0.1)] outline-none focus:border-[#0ff0fc] focus:shadow-[inset_0_0_15px_rgba(0,255,255,0.3),0_0_10px_rgba(0,255,255,0.2)]"
					placeholder="ENTER COMMAND..."
				></textarea>
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
			opacity: 1;
			filter: brightness(1) saturate(1);
			transform: scale(1);
		}
	}
</style>
