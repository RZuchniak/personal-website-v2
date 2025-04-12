<script>
	let { gif } = $props();
</script>

<div class="vignette-container h-screen-5/6 w-screen-5/6 flex items-center justify-center">
	<div class="relative h-full w-full">
		<img src={gif} class="source-image animate-fade-in h-max w-max object-cover" />
		<div class="scanline-effect pointer-events-none absolute inset-0"></div>
	</div>
</div>

<style>
	@property --gradient-expand {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 0%;
	}

	@keyframes expand-gradient {
		0% {
			--gradient-expand: 0%;
		}
		100% {
			--gradient-expand: 70%;
		}
	}
	@keyframes scanline {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 0 100%;
		}
	}
	.source-image {
		--gradient-expand: 100%;
		display: block;
		width: 100%;
		height: auto;
		mask-image: radial-gradient(
			ellipse,
			black 0%,
			rgba(0, 0, 0, 0.75) calc(var(--gradient-expand) - 30%),
			transparent var(--gradient-expand)
		);
		animation: expand-gradient 0.5s cubic-bezier(0.1, 0, 0.8, 1) forwards;
	}

	.scanline-effect {
		background: linear-gradient(rgba(255, 255, 255, 0.1) 2px, transparent 1px);
		background-size: 100% 4px;
		animation: scanline 2s linear infinite;
		mask-image: radial-gradient(
			ellipse,
			black 0%,
			rgba(0, 0, 0, 0.8) calc(var(--gradient-expand) - 30%),
			transparent var(--gradient-expand)
		);
		animation: expand-gradient 0.5s cubic-bezier(0.1, 0, 0.8, 1) forwards;
	}
</style>
