<script lang="ts">
	import CameraControl from '../lib/CameraControls';
	import type CC from 'camera-controls';
	import { T, useTask, useThrelte, useLoader } from '@threlte/core';
	import { Environment, interactivity, Stars } from '@threlte/extras';
	import { Spring } from 'svelte/motion';
	import { PerspectiveCamera, TextureLoader } from 'three';
	import { loadModels } from '../lib/render';

	const { dom, invalidate } = useThrelte();

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
			controls.setPosition(4 * pointer.current.x, 4 * pointer.current.y, 50, true);
			controls.setTarget(4 * pointer.current.x, 4 * pointer.current.y, 0, true);
			if (controls.update(delta)) {
				invalidate();
			}
		},
		{ autoInvalidate: false }
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
	<T.SphereGeometry args={[5, 32, 32]}/>
	{#if $texture}
		<T.MeshBasicMaterial map={$texture} />
	{/if}
</T.Mesh>

<Stars radius={100} />
