<script lang="ts">
	import CameraControl from '../lib/CameraControls';
	import type CC from 'camera-controls';
	import { T, useTask, useThrelte } from '@threlte/core';
	import { interactivity, OrbitControls, Stars } from '@threlte/extras';
	import { PerspectiveCamera } from 'three';
	import { loadModels } from '../lib/render';
	import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
	import Planet from './Planet.svelte';
	import ProjectDescription from './ProjectDescription.svelte';
	import CssObject from './CssObject.svelte';

	let { element }: { element: HTMLElement } = $props();

	let zoomed = $state(false);
	let zooming = $state(false);
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
	const jupiterTexture = models.jupiterTexture;
	const marsTexture = models.marsTexture;
	const neptuneTexture = models.neptuneTexture;
	const makemakeTexture = models.makemakeTexture;
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
		}
	};

	const rotationToHeight = (rotation: number) => {
		return Math.sin(rotation) * 25;
	};

	let rotation = $state(0);

	useTask((delta) => {
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
			}
		}
	});

	const cssRenderer = $derived(new CSS2DRenderer({ element }));

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
	scale={1.2}
	{zoomed}
	{zooming}
	{viewPlanet}
	{rotationToHeight}
	texture={marsTexture}
	projectName="PACE"
	projectDescription="Pace is a first person puzzle game that sees the player solving jigsaw puzzles on an abandoned space station. Built entirely in Godot, I was able to implement a custom portal system similar to that of Portal 1, allowing for seamless teleportation."
	{image}
></Planet>

<Planet
	position={[-120, 50, -50]}
	rotation={rotation * 1}
	{zoomed}
	{zooming}
	{viewPlanet}
	{rotationToHeight}
	texture={jupiterTexture}
	projectName="MOSAIC"
	projectDescription="Based off of r/Place, Mosaic allows users to place individual tiles on a board to slowly create art. Built using React, along with Socket.io and PostgreSQL for the back-end"
	github="https://github.com/rzuchniak/mosaic"
	website="https://mosaic.robertzuchniak.com/"
	{image}
></Planet>

<Planet
	position={[-135, -40, 30]}
	rotation={rotation * 4}
	{zoomed}
	{zooming}
	{viewPlanet}
	{rotationToHeight}
	texture={neptuneTexture}
	projectName="MOUND"
	projectDescription="Developed for Hack the Hill, Mound is a peer-to-peer distributed file sharing system. Upon connecting to a network, any files uploaded are automatically chunked and shared with all peers, which allows for robust downloads that do not rely on a single server, meaning in the event of a disconnection, the file can still be downloaded from other peers.
	I helped to develop the Electron front end, and helped to connect it to the cli being run as a child process through an IPC connection."
	{image}
></Planet>

<Planet
	position={[125, 40, 60]}
	rotation={rotation * -2}
	{zoomed}
	{zooming}
	scale={1.2}
	{viewPlanet}
	{rotationToHeight}
	texture={makemakeTexture}
	{image}
	projectName="GRAPHICS ENGINE"
	projectDescription="A graphics engine built entirely in Rust and leveraging the wgpu library. "
></Planet>
<T.DirectionalLight position={[0, 50, 100]} intensity={1} />

<Stars radius={750} factor={35} />
