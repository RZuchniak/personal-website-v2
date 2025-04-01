<script lang="ts">
	import { materialRotation } from 'three/tsl';
	import CssObject from './CssObject.svelte';

	let {
		rotation,
		hover,
		rotationToHeight,
		image
	}: {
		rotation: number;
		hover: boolean;
		rotationToHeight: (rotation: number) => number;
		image: string;
	} = $props();
</script>

<CssObject center={[0.5, 0.5]} position={[0, rotationToHeight(rotation + Math.PI / 2), 25]}>
	{#snippet content()}
		{#if hover}
			<div class="relative flex h-12 w-12 items-center justify-center align-middle">
				<!-- Circular image container with vignette -->
				<div class="absolute inset-0 overflow-hidden rounded-full">
					<img src={image} alt="image" class="fade-in h-full w-full object-cover" />
				</div>
			</div>
		{/if}
	{/snippet}
</CssObject>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.fade-in {
		animation: fadeIn 0.5s ease-in forwards;
	}
</style>
