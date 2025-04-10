import { useLoader } from '@threlte/core';
import * as THREE from 'three';

export function loadModels() {
    const neptuneTexture = useLoader(THREE.TextureLoader).load('./neptune.jpg');
    const jupiterTexture = useLoader(THREE.TextureLoader).load('./jupiter.jpg');
    const marsTexture = useLoader(THREE.TextureLoader).load('./mars.jpg');
    const makemakeTexture = useLoader(THREE.TextureLoader).load('./makemake.jpg');

    return {
        neptuneTexture,
        jupiterTexture,
        marsTexture,
        makemakeTexture,
    }
}