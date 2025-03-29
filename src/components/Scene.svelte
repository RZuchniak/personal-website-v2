<script lang="ts">
	import CameraControl from '../lib/CameraControls';
	import type CC from 'camera-controls';
	import { T, useTask, useThrelte, useLoader } from '@threlte/core';
	import { Environment, global, interactivity, Stars } from '@threlte/extras';
	import { Spring } from 'svelte/motion';
	import { PerspectiveCamera, TextureLoader, Vector3 } from 'three';
	import { loadModels } from '../lib/render';
	import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
	import ProjectDescription from './ProjectDescription.svelte';
	import CssObject from './CssObject.svelte';
	import Planet from './Planet.svelte';
	import { PI } from 'three/tsl';

	let { element }: { element: HTMLElement } = $props();

	let zoomed = $state(false);
	let zooming = $state(false);
	let display = $state(false);
	let timer = $state(0);
	let hover = $state(false);

	const globalPosition = $state({
		x: 0,
		y: 0,
		z: 400
	});

	const { autoRenderTask, dom, invalidate, size, scene } = useThrelte();

	const camera = new PerspectiveCamera(30);
	let controls: CC = new CameraControl(dom, camera);
	controls.enabled = false;

	controls.setPosition(globalPosition.x, globalPosition.y, globalPosition.z, false);

	const { pointer } = interactivity();

	const scale = new Spring(1);
	let models = loadModels();
	const texture = models.jupiterTexture;
	const image = models.image;

	const viewPlanet = (location: Vector3) => {
		if (zooming) return;
		if (!zoomed) {
			globalPosition.x = location.x + 30;
			globalPosition.y = location.y;
			globalPosition.z = location.z + 140;
			zooming = true;
		} else {
			globalPosition.x = 0;
			globalPosition.y = 0;
			globalPosition.z = 400;
			zooming = true;
			display = false;
		}
	};

	const rotationToHeight = (rotation: number) => {
		return Math.sin(rotation) * 25;
	};

	let rotation = $state(0);

	useTask(
		(delta) => {
			controls.setPosition(
				4 * pointer.current.x + globalPosition.x,
				4 * pointer.current.y + globalPosition.y,
				globalPosition.z,
				true
			);
			controls.setTarget(
				4 * pointer.current.x + globalPosition.x,
				4 * pointer.current.y + globalPosition.y,
				0,
				true
			);
			if (controls.update(delta)) {
				invalidate();
			}
			rotation += delta;
			if (rotation > Math.PI * 2) {
				rotation = 0;
			}
			if (zooming) {
				timer += delta;
				if (timer > 0.85) {
					timer = 0;
					zooming = false;
					zoomed = !zoomed;
					if (zoomed) display = true;
				}
			}
		},
		{ autoInvalidate: false }
	);

	const cssRenderer = new CSS2DRenderer({ element });

	$effect(() => {
		cssRenderer.setSize($size.width, $size.height);
	});

	const last = scene.matrixWorldAutoUpdate;
	scene.matrixWorldAutoUpdate = false;
	$effect(() => {
		return () => {
			scene.matrixWorldAutoUpdate = last;
		};
	});

	useTask(
		(delta) => {
			scene.updateMatrixWorld();
		},
		{ before: autoRenderTask }
	);

	useTask(
		() => {
			cssRenderer.render(scene, camera);
		},
		{
			after: autoRenderTask,
			autoInvalidate: false
		}
	);
</script>

<T is={camera} makeDefault />

<T.Mesh
	rotation.y={rotation}
	position={[50, 30, 0]}
	scale={scale.current}
	onpointerenter={() => {
		scale.target = 1.0;
		hover = !zoomed && !zooming;
	}}
	onclick={() => {
		viewPlanet(new Vector3(50, 30, 0));
		hover = false;
	}}
	onpointerleave={() => {
		scale.target = 1.0;
		hover = false;
	}}
>
	<CssObject center={[0.5, 0.5]} position={[0, rotationToHeight(rotation + Math.PI / 2), 25]}>
		{#snippet content()}
			{#if hover}
				<div class="relative h-12 w-12">
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
	<T.SphereGeometry args={[20, 64, 64]} />
	{#if $texture}
		<T.MeshStandardMaterial map={$texture} roughness={0.8} metalness={0.1} bumpScale={0.05} />
	{/if}
</T.Mesh>

<CssObject center={[0.5, 0.5]} position={[110, 30, 0]}>
	{#snippet content()}
		{#if display}
			<ProjectDescription />
		{/if}
	{/snippet}
</CssObject>

<Planet
	position={[0, 0, 0]}
	{rotation}
	{zoomed}
	{zooming}
	{viewPlanet}
	{rotationToHeight}
	{texture}
	{image}
></Planet>

<T.DirectionalLight position={[0, 50, 100]} intensity={1} />

<Stars radius={750} factor={30} />
