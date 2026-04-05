<script lang="ts">
	import CameraControl from '../lib/CameraControls';
	import type CC from 'camera-controls';
	import { T, useTask, useThrelte } from '@threlte/core';
	import { interactivity, OrbitControls, Stars } from '@threlte/extras';
	import { PerspectiveCamera } from 'three';
	import { orientationPermissionNeeded } from '../lib/deviceMotion';
	import { preloadProjectMedia } from '../lib/preloadAssets';
	import { loadModels } from '../lib/render';
	import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
	import Planet from './Planet.svelte';
	import ProjectDescription from './ProjectDescription.svelte';
	import CssObject from './CssObject.svelte';

	let {
		element,
		motionSteeringActive = false
	}: { element: HTMLElement; motionSteeringActive?: boolean } = $props();

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

	$effect(() => {
		preloadProjectMedia();
	});

	let models = loadModels();
	const jupiterTexture = models.jupiterTexture;
	const marsTexture = models.marsTexture;
	const neptuneTexture = models.neptuneTexture;
	const makemakeTexture = models.makemakeTexture;

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
		return Math.sin(rotation) * 27;
	};

	let rotation = $state(0);

	let motionTarget = $state({ x: 0, y: 0 });
	let motionSmooth = $state({ x: 0, y: 0 });

	/** Raw device angles at “neutral” — offsets are computed relative to this. */
	let orientationBaseline: { beta: number; gamma: number } | null = null;

	function displayAngleDegrees(): number {
		const so = typeof screen !== 'undefined' ? screen.orientation : undefined;
		if (so?.angle != null && !Number.isNaN(so.angle)) return so.angle;
		if (typeof window !== 'undefined' && typeof window.orientation === 'number') {
			return window.orientation;
		}
		return 0;
	}

	/**
	 * Map device beta/gamma into screen-relative tilt.
	 * In landscape, axes are rotated so “steering wheel” roll vs “top toward you” pitch map to X/Y.
	 */
	function orientationBucket(angleDeg: number): 0 | 90 | 180 | 270 {
		const a = ((angleDeg % 360) + 360) % 360;
		if (a >= 45 && a < 135) return 90;
		if (a >= 135 && a < 225) return 180;
		if (a >= 225 && a < 315) return 270;
		return 0;
	}

	function deviceToScreenTilt(beta: number, gamma: number, angleDeg: number): { x: number; y: number } {
		const a = orientationBucket(angleDeg);
		const pitchFromUpright = beta - 90;

		if (a === 90) {
			return { x: pitchFromUpright, y: -gamma };
		}
		if (a === 270) {
			return { x: -pitchFromUpright, y: gamma };
		}
		if (a === 180) {
			return { x: -gamma, y: -pitchFromUpright };
		}
		return { x: gamma, y: pitchFromUpright };
	}

	$effect(() => {
		const resetBaseline = () => {
			orientationBaseline = null;
		};
		screen.orientation?.addEventListener?.('change', resetBaseline);
		window.addEventListener('orientationchange', resetBaseline);
		return () => {
			screen.orientation?.removeEventListener?.('change', resetBaseline);
			window.removeEventListener('orientationchange', resetBaseline);
		};
	});

	$effect(() => {
		if (!motionSteeringActive && orientationPermissionNeeded()) {
			orientationBaseline = null;
			motionTarget = { x: 0, y: 0 };
			motionSmooth = { x: 0, y: 0 };
		}
	});

	function onDeviceOrientation(event: DeviceOrientationEvent) {
		const needPerm = orientationPermissionNeeded();
		if (needPerm && !motionSteeringActive) {
			orientationBaseline = null;
			motionTarget = { x: 0, y: 0 };
			return;
		}
		if (event.gamma === null || event.beta === null) return;

		const beta = event.beta;
		const gamma = event.gamma;
		const angle = displayAngleDegrees();

		if (orientationBaseline === null) {
			orientationBaseline = { beta, gamma };
			motionTarget = { x: 0, y: 0 };
			return;
		}

		const cur = deviceToScreenTilt(beta, gamma, angle);
		const base = deviceToScreenTilt(orientationBaseline.beta, orientationBaseline.gamma, angle);
		let dx = cur.x - base.x;
		let dy = cur.y - base.y;

		dx = Math.max(-55, Math.min(55, dx));
		dy = Math.max(-55, Math.min(55, dy));

		/* Map view: more sensitive. Zoomed on a planet + description: gentler so text stays readable. */
		const gainX = zoomed ? 20 : 52;
		const gainY = zoomed ? 16 : 44;
		motionTarget.x = -(dx / 55) * gainX;
		motionTarget.y = (dy / 55) * gainY;
	}

	useTask((delta) => {
		const k = 1 - Math.pow(0.001, delta);
		motionSmooth.x += (motionTarget.x - motionSmooth.x) * k;
		motionSmooth.y += (motionTarget.y - motionSmooth.y) * k;

		const mx = motionSmooth.x;
		const my = motionSmooth.y;

		controls.setPosition(
			4 * pointer.current.x + globalPosition.x + mx,
			4 * pointer.current.y + globalPosition.y + my,
			globalPosition.z,
			true
		);
		controls.setTarget(
			4 * pointer.current.x + globalPosition.x + mx,
			4 * pointer.current.y + globalPosition.y + my,
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
	tools={['godot']}
	gif="gifs/pace.gif"
	github="https://github.com/vasiltop/pace"
	website="https://munost.itch.io/pace"
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
	gif="gifs/mosaic.gif"
	tools={['react']}
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
	tools={['rust', 'svelte']}
	gif="gifs/mound.gif"
	github="https://github.com/orgs/mound-p2p/repositories"
	website="https://devpost.com/software/mound"
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
	projectName="RENDERER"
	projectDescription="An object renderer built in Rust, leveraging the wgpu library and wgsl. "
	tools={['wgsl', 'rust']}
	gif="gifs/renderer.gif"
	github="https://github.com/RZuchniak/Renderer"
></Planet>
<T.DirectionalLight position={[0, 50, 100]} intensity={1} />

<Stars radius={750} factor={52} />

<svelte:window on:deviceorientation={onDeviceOrientation} />
