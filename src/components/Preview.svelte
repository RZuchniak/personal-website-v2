<script>
	import image from './whirl_screenshot.png';
</script>

<div class="vignette-container flex w-100 items-center">
	<img src={image} class="source-image" />
</div>

<style>
	.source-image {
		display: block;
		width: 100%;
		height: auto;
		mask-image: radial-gradient(circle, black, transparent 90%);
	}
</style>
