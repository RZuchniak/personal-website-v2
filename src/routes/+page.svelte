<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '../components/Scene.svelte';

	let element: HTMLElement | undefined = $state();

	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let isopen = $state(true);
</script>

<div id="css-renderer-target" bind:this={element} />

<div id="main" class="aspect-auto h-screen w-screen">
	<Dialog.Root open={isopen}>
		<Dialog.Overlay class="bg-black/100"></Dialog.Overlay>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Welcome to my Portfolio!</Dialog.Title>
				<Dialog.Description>
					Click on a planet to view details about each project. Click on it again to go back. If you
					are on mobile or are unable to see any planets click the link below to be taken to my
					regular portolio.
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer>
				<Button type="button" on:click={() => (window.location.href = 'https://google.com')}
					>Alternate Portfolio</Button
				>
				<Button
					type="submit"
					on:click={() => {
						isopen = false;
					}}>Continue</Button
				>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
	<Canvas>
		{#if element !== undefined}
			<Scene {element} />
		{/if}
	</Canvas>
</div>

<style>
	div#main {
		height: 100%;
	}
	#css-renderer-target {
		left: 0;
		pointer-events: none;
		position: absolute;
		top: 0;
		z-index: 10;
	}
</style>
