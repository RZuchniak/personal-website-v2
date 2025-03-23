<script lang="ts">
	import CameraControl from '../lib/CameraControls';
	import type CC from 'camera-controls';
	import { T, useTask, useThrelte } from '@threlte/core';
	import { interactivity } from '@threlte/extras';
	import { Spring } from 'svelte/motion';
	import { PerspectiveCamera, Vector3 } from 'three';

	const { dom, invalidate } = useThrelte();

	const camera = new PerspectiveCamera();
	camera.position.set(5, 5, 5);
	let controls: CC = new CameraControl(dom, camera);

	const { pointer } = interactivity();

	const scale = new Spring(1);
	let cameraPosition = [5, 5, 5];

	useTask(
		(delta) => {
			console.log(pointer.current.x);
			controls.setTarget(10 * pointer.current.x, 10 * pointer.current.y, 0, true);
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
	<T.BoxGeometry />
	<T.MeshBasicMaterial color="red" />
</T.Mesh>
