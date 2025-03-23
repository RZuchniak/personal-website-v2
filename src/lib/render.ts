	import CameraControl from '../lib/CameraControls';
	import type CC from 'camera-controls';
	import { T, useTask, useThrelte, useLoader } from '@threlte/core';
	import { interactivity } from '@threlte/extras';
	import { Spring } from 'svelte/motion';
	import * as THREE from 'three';

export function loadModels() {
    const neptuneTexture = useLoader(THREE.TextureLoader).load('./2k_neptune.jpg');
    //const starsGeometry = new THREE.SphereGeometry(1000, 60, 40);
    //const starsMaterial = new THREE.MeshBasicMaterial({ map: starsTexture, side: THREE.BackSide });
    //const stars = new THREE.Mesh(starsGeometry, starsMaterial);

    return {
        neptuneTexture
    }
}