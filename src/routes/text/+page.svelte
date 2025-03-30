<script>
	import image from './whirl_screenshot.png';
</script>

<div class="vignette-container">
	<img src={image} class="source-image" />
</div>

<style>
	.vignette-container {
		--mask-size: 100%;
		display: inline-block;
		position: relative;
	}

	.source-image {
		border-radius: 50%;
		display: block;
		border: 1px solid #000000;
		width: 100%;
		height: auto;
		mask-image: radial-gradient(circle, transparent 5%, black);
	}

	.vignette-container::after {
		content: '';
		position: absolute;
		inset: 0;
		mask: radial-gradient(
			circle,
			transparent var(--mask-size),
			black calc(var(--mask-size) + 0.5%)
		);
		background: white;
		pointer-events: none;
	}
</style>
