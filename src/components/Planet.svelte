<script lang="ts">
	import { T } from '@threlte/core';
	import { Vector3 } from 'three';
	import { PI } from 'three/tsl';
	import CssObject from './CssObject.svelte';
	import { Spring } from 'svelte/motion';
	import ProjectDescription from './ProjectDescription.svelte';
	import type { Texture } from 'three';
	import type { AsyncWritable } from '@threlte/core';
	import whirl from './whirl_screenshot.png';
	import Preview from './Preview.svelte';
	import TypeWriter from 'svelte-typewriter';

	let {
		rotation,
		zoomed,
		zooming,
		viewPlanet,
		rotationToHeight,
		texture,
		position,
		image
	}: {
		rotation: number;
		zoomed: boolean;
		zooming: boolean;
		viewPlanet: (location: [number, number, number]) => void;
		rotationToHeight: (rotation: number) => number;
		texture: AsyncWritable<Texture>;
		position: [number, number, number];
		image: string;
	} = $props();

	let scale = new Spring(1);
	let hover = $state(false);
	let display = $state(false);
</script>

<T.Mesh
	rotation.y={rotation}
	{position}
	scale={scale.current}
	onpointerenter={() => {
		scale.target = 1.0;
		hover = !zoomed && !zooming;
	}}
	onclick={() => {
		if (!zoomed && !zooming) {
			hover = false;
			setTimeout(() => {
				display = true;
			}, 850);
		} else {
			display = false;
		}
		viewPlanet(position);
	}}
	onpointerleave={() => {
		scale.target = 1.0;
		hover = false;
	}}
>
	<CssObject center={[0.5, 0.5]} position={[0, rotationToHeight(rotation + Math.PI / 2), 25]}>
		{#snippet content()}
			{#if hover}
				<div class="relative flex h-12 w-12 items-center justify-center align-middle">
					<!-- Circular image container with vignette -->
					<div class="absolute inset-0 overflow-hidden rounded-full">
						<img src={image} alt="image" class="h-full w-full object-cover" />
						<div
							class="absolute inset-0
           [mask-image:radial-gradient(circle_at_center,white_30%,transparent_70%)]"
						></div>
					</div>
				</div>
			{/if}
		{/snippet}
	</CssObject>
	<CssObject center{[0.5, 0.5]} position={[0, 0, 0]}>
		{#snippet content()}
			<div>
				<p>Hello WOrld</p>
			</div>
		{/snippet}
	</CssObject>
	<!----
	<CssObject center={[0.5, 0.5]} position={[0, 0, 0]}>
		{#snippet content()}
			<div class="relative h-64">
				<img src={whirl} alt="image" class="h-full w-full object-cover" />
			</div>
		{/snippet}
	</CssObject>
    -->
	<CssObject center={[0.5, 0.5]} position={[0, 0, 0]}>
		{#snippet content()}
			{#if display}
				<Preview />
			{/if}
		{/snippet}
	</CssObject>
	<T.SphereGeometry args={[20, 64, 64]} />
	{#if $texture}
		<T.MeshStandardMaterial map={$texture} roughness={0.8} metalness={0.1} bumpScale={0.05} />
	{/if}
</T.Mesh>

<CssObject center={[0.5, 0.5]} position={[position[0] + 50, position[1], position[2]]}>
	{#snippet content()}
		{#if display}
			<ProjectDescription />
		{/if}
	{/snippet}
</CssObject>
