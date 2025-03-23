<script lang="ts">
	import CameraControl from '../lib/CameraControls';
	import type CC from 'camera-controls';
	import { T, useTask, useThrelte, useLoader } from '@threlte/core';
	import { Environment, interactivity, Stars } from '@threlte/extras';
	import { Spring } from 'svelte/motion';
	import { PerspectiveCamera, TextureLoader } from 'three';
	import { loadModels } from '../lib/render';
	import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
	import MosaicDescription from './MosaicDescription.svelte';
	import CssObject from './CssObject.svelte';

	let { element }: { element: HTMLElement } = $props();

	const { autoRenderTask, dom, invalidate, size, scene } = useThrelte();

	const camera = new PerspectiveCamera();
	camera.position.set(0, 0, -10);
	let controls: CC = new CameraControl(dom, camera);
	controls.enabled = false;

	const { pointer } = interactivity();

	const scale = new Spring(1);
	let models = loadModels();
	const texture = models.neptuneTexture;

	useTask(
		(delta) => {
			controls.setPosition(4 * pointer.current.x, 4 * pointer.current.y, 150, true);
			controls.setTarget(4 * pointer.current.x, 4 * pointer.current.y, 0, true);
			if (controls.update(delta)) {
				invalidate();
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
		() => {
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
	scale={scale.current}
	onpointerenter={() => {
		scale.target = 1.5;
	}}
	onpointerleave={() => {
		scale.target = 1;
	}}
>
	<T.SphereGeometry args={[10, 32, 32]} />
	{#if $texture}
		<T.MeshBasicMaterial map={$texture} />
	{/if}
</T.Mesh>

<Stars radius={200} factor={10}/>

<CssObject center={[0.5, 0.5]} position={[0, 0, 0]}>
	{#snippet content()}
		<MosaicDescription />
	{/snippet}
</CssObject>
