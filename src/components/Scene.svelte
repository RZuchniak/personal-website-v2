<script lang="ts">
	import CameraControl from '../lib/CameraControls';
	import type CC from 'camera-controls';
	import { T, useTask, useThrelte } from '@threlte/core';
	import { interactivity, Stars } from '@threlte/extras';
	import { PerspectiveCamera } from 'three';
	import { loadModels } from '../lib/render';
	import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
	import Planet from './Planet.svelte';

	let { element }: { element: HTMLElement } = $props();

	let zoomed = $state(false);
	let zooming = $state(false);
	let display = $state(false);
	let timer = $state(0);

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

	let models = loadModels();
	const texture = models.jupiterTexture;
	const image = models.image;

	const viewPlanet = (location: [number, number, number]) => {
		if (zooming) return;
		if (!zoomed) {
			globalPosition.x = location[0] + 30;
			globalPosition.y = location[1];
			globalPosition.z = location[2] + 100;
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
			rotation += delta / 4;
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

<Planet
	position={[0, 0, 0]}
	rotation={rotation * 2}
	{zoomed}
	{zooming}
	{viewPlanet}
	{rotationToHeight}
	{texture}
	{image}
></Planet>

<Planet
	position={[80, 30, 0]}
	rotation={rotation * 4}
	{zoomed}
	{zooming}
	{viewPlanet}
	{rotationToHeight}
	{texture}
	{image}
></Planet>
<T.DirectionalLight position={[0, 50, 100]} intensity={1} />

<Stars radius={750} factor={30} />
