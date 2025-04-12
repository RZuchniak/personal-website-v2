<script lang="ts">
	import { T } from '@threlte/core';
	import CssObject from './CssObject.svelte';
	import { Spring } from 'svelte/motion';
	import ProjectDescription from './ProjectDescription.svelte';
	import type { Texture } from 'three';
	import type { AsyncWritable } from '@threlte/core';
	import Preview from './Preview.svelte';
	import TypeWriter from 'svelte-typewriter';
	import Tool from './Tool.svelte';

	type Tooltype = 'svelte' | 'rust' | 'react' | 'godot' | 'wgsl';

	let {
		rotation,
		zoomed,
		zooming,
		scale: inputScale = 1,
		viewPlanet,
		rotationToHeight,
		texture,
		position,
		tools,
		projectName = undefined,
		projectDescription = undefined,
		github,
		website,
		gif
	}: {
		rotation: number;
		zoomed: boolean;
		zooming: boolean;
		scale?: number;
		viewPlanet: (location: [number, number, number]) => void;
		rotationToHeight: (rotation: number) => number;
		texture: AsyncWritable<Texture>;
		position: [number, number, number];
		tools?: Tooltype[];
		projectName?: string;
		projectDescription?: string;
		github?: string;
		website?: string;
		gif?: string;
	} = $props();

	let scale = new Spring(inputScale);
	let hover = $state(false);
	let display = $state(false);
</script>

<T.Mesh
	rotation.y={rotation}
	{position}
	scale={scale.current}
	onpointerenter={() => {
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
		hover = false;
	}}
>
	<CssObject center={[0.5, 0.5]} position={[0, 0, 0]}>
		{#snippet content()}
			{#if hover}
				<TypeWriter keepCursorOnFinish>
					<h class="flex items-center text-center text-2xl font-bold break-words">
						{projectName || 'MOSAIC'}
					</h>
				</TypeWriter>
			{/if}
		{/snippet}
	</CssObject>
	<CssObject center={[0.5, 0.5]} position={[0, 0, 0]}>
		{#snippet content()}
			{#if display}
				<Preview {gif} />
			{/if}
		{/snippet}
	</CssObject>
	<T.SphereGeometry args={[20, 64, 64]} />
	{#if $texture}
		<T.MeshStandardMaterial map={$texture} roughness={0.8} metalness={0.1} bumpScale={0.05} />
	{/if}
</T.Mesh>
{#if tools}
	{#each tools as tool, index}
		<Tool
			{rotation}
			{hover}
			{rotationToHeight}
			image={tool}
			{position}
			offset={index / tools.length}
		/>
	{/each}
{/if}
<CssObject center={[0.5, 0.5]} position={[position[0] + 50, position[1], position[2]]}>
	{#snippet content()}
		{#if display}
			<ProjectDescription {projectName} {projectDescription} {github} {website} />
		{/if}
	{/snippet}
</CssObject>
