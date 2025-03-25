<script lang="ts">
	import CameraControl from '../lib/CameraControls';
	import type CC from 'camera-controls';
	import { T, useTask, useThrelte, useLoader } from '@threlte/core';
	import { Environment, global, interactivity, Stars } from '@threlte/extras';
	import { Spring } from 'svelte/motion';
	import { PerspectiveCamera, TextureLoader, Vector3 } from 'three';
	import { loadModels } from '../lib/render';
	import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
	import MosaicDescription from './MosaicDescription.svelte';
	import CssObject from './CssObject.svelte';

	let { element }: { element: HTMLElement } = $props();

	const globalPosition = $state({
		x: 0,
		y: 0,
		z: 200
	});

	const { autoRenderTask, dom, invalidate, size, scene } = useThrelte();

	const camera = new PerspectiveCamera();
	let controls: CC = new CameraControl(dom, camera);
	controls.enabled = false;

	controls.setPosition(globalPosition.x, globalPosition.y, globalPosition.z, false);

	const { pointer } = interactivity();

	const scale = new Spring(1);
	let models = loadModels();
	const texture = models.jupiterTexture;

	const viewPlanet = (location: Vector3) => {
		globalPosition.x = location.x + 20;
		globalPosition.y = location.y;
		globalPosition.z = location.z + 70;
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
			rotation += delta / 5;
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
	position={[50, 0, 0]}
	scale={scale.current}
	onpointerenter={() => {
		scale.target = 1.5;
	}}
	onclick={() => {
		viewPlanet(new Vector3(50, 0, 0));
	}}
	onpointerleave={() => {
		scale.target = 1.0;
	}}
>
	<CssObject center={[0.5, 0.5]} position={[0, 0, 0]}>
		{#snippet content()}
			<MosaicDescription />
		{/snippet}
	</CssObject>
	<T.SphereGeometry args={[20, 64, 64]} />
	{#if $texture}
		<T.MeshStandardMaterial map={$texture} roughness={0.8} metalness={0.1} bumpScale={0.05} />
	{/if}
</T.Mesh>

<T.DirectionalLight position={[0, 50, 100]} intensity={1} />

<Stars radius={200} factor={10} />
