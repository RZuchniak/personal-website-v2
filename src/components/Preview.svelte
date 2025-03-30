<script>
	import image from './template.gif';
</script>

<div class="vignette-container flex h-1/2 w-1/2 justify-center justify-items-center">
	<img src={image} class="source-image h-full w-full object-cover" />
	<div class="scanline-effect pointer-events-none absolute inset-0"></div>
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
			circle,
			black 0%,
			rgba(0, 0, 0, 0.7) calc(var(--gradient-expand) - 30%),
			transparent var(--gradient-expand)
		);
		animation: expand-gradient 0.5s cubic-bezier(0.1, 0, 0.8, 1) forwards;
	}

	.scanline-effect {
		background: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
		background-size: 100% 4px;
		animation: scanline 2s linear infinite;
		mask-image: radial-gradient(
			circle,
			black 0%,
			rgba(0, 0, 0, 0.7) calc(var(--gradient-expand) - 30%),
			transparent var(--gradient-expand)
		);
		animation: expand-gradient 0.5s cubic-bezier(0.1, 0, 0.8, 1) forwards;
	}
</style>
