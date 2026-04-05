<script lang="ts">
	import '../app.css';
	import '@fontsource/orbitron/400.css';
	import '@fontsource/orbitron/700.css';
	import '@fontsource/share-tech-mono/400.css';

	let { children } = $props();
</script>

<div class="app">
	<main>
		{@render children()}
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		height: 100dvh;
	}

	main {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-height: 0;
	}
</style>
