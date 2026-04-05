<script lang="ts">
	import { Canvas } from '@threlte/core';
	import MobileSpaceHints from '../components/MobileSpaceHints.svelte';
	import Scene from '../components/Scene.svelte';

	let element: HTMLElement | undefined = $state();
	let motionSteering = $state(false);

	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { cn } from '$lib/utils.js';

	let isopen = $state(true);
	let mobileHintsActive = $state(false);

	$effect(() => {
		if (isopen) {
			mobileHintsActive = false;
			return;
		}
		const id = setTimeout(() => {
			mobileHintsActive = true;
		}, 320);
		return () => clearTimeout(id);
	});
</script>

<div id="css-renderer-target" bind:this={element}></div>

<div id="main" class="relative flex min-h-dvh h-dvh w-full flex-col overflow-hidden">
	<Dialog.Root bind:open={isopen}>
		<Dialog.Content
			class="welcome-dialog sm:max-w-[min(92vw,520px)] w-full overflow-visible border-0 bg-transparent p-0 shadow-none"
			overlayClass="bg-black backdrop-blur-none"
		>
			<div class="welcome-shell">
				<div class="welcome-grid-bg" aria-hidden="true"></div>
				<div class="welcome-scanlines" aria-hidden="true"></div>
				<div
					class="welcome-inner relative z-10 border border-cyan-400/45 bg-slate-950/95 p-8 shadow-[0_0_80px_rgba(34,211,238,0.12),inset_0_0_60px_rgba(6,182,212,0.04)] sm:rounded-sm"
				>
					<div class="welcome-corners pointer-events-none" aria-hidden="true"></div>
					<p
						class="mb-4 font-mono text-[10px] tracking-[0.4em] text-cyan-500/90 uppercase"
					>
						Orbital portfolio · uplink ready
					</p>
					<Dialog.Header class="space-y-4 text-left sm:text-left">
						<Dialog.Title
							class="font-display text-2xl leading-tight font-bold tracking-[0.14em] text-cyan-100 uppercase drop-shadow-[0_0_18px_rgba(34,211,238,0.35)] sm:text-3xl"
						>
							Welcome
						</Dialog.Title>
						<Dialog.Description
							class="text-sm leading-relaxed text-cyan-100/70"
						>
							Select a planet to open a project briefing. Select it again to return to the system
							map. If planets are hard to see on your device, use the link below for the classic
							portfolio.
						</Dialog.Description>
					</Dialog.Header>
					<Dialog.Footer class="mt-8 flex-col gap-3 sm:flex-row sm:justify-end sm:space-x-3">
						<a
							href="https://robertzuchniak.com/"
							class={cn(
								buttonVariants({ variant: 'outline' }),
								'border-cyan-400/55 bg-cyan-950/20 font-display tracking-wide text-cyan-200 hover:border-cyan-300 hover:bg-cyan-950/40 hover:text-cyan-50'
							)}
							rel="noopener noreferrer"
						>
							Classic portfolio
						</a>
						<Button
							type="button"
							class="font-display border-0 bg-cyan-500 tracking-wide text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.35)] hover:bg-cyan-400"
							on:click={() => {
								isopen = false;
							}}>Continue</Button>
					</Dialog.Footer>
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Root>
	<MobileSpaceHints afterWelcome={mobileHintsActive} bind:motionSteering={motionSteering} />
	<div class="canvas-shell min-h-0 w-full flex-1">
		<Canvas>
			{#if element !== undefined}
				<Scene {element} motionSteeringActive={motionSteering} />
			{/if}
		</Canvas>
	</div>
</div>

<style>
	#css-renderer-target {
		left: 0;
		pointer-events: none;
		position: absolute;
		top: 0;
		z-index: 10;
	}

	.canvas-shell {
		position: relative;
		min-height: 0;
	}

	.canvas-shell :global(> div) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.welcome-shell {
		position: relative;
		padding: 2px;
	}

	.welcome-grid-bg {
		position: absolute;
		inset: -20%;
		background-image:
			linear-gradient(rgba(34, 211, 238, 0.07) 1px, transparent 1px),
			linear-gradient(90deg, rgba(34, 211, 238, 0.07) 1px, transparent 1px);
		background-size: 20px 20px;
		mask-image: radial-gradient(ellipse 80% 70% at 50% 45%, black 20%, transparent 75%);
		pointer-events: none;
		opacity: 0.85;
	}

	.welcome-scanlines {
		position: absolute;
		inset: 0;
		background: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px);
		background-size: 100% 3px;
		pointer-events: none;
		opacity: 0.35;
		animation: welcome-scan 10s linear infinite;
	}

	@keyframes welcome-scan {
		from {
			background-position: 0 0;
		}
		to {
			background-position: 0 100%;
		}
	}

	.welcome-corners {
		position: absolute;
		inset: 10px;
		z-index: 5;
	}

	.welcome-corners::before,
	.welcome-corners::after {
		content: '';
		position: absolute;
		width: 28px;
		height: 28px;
		border: 2px solid rgba(34, 211, 238, 0.55);
	}

	.welcome-corners::before {
		top: 0;
		left: 0;
		border-right: none;
		border-bottom: none;
		box-shadow: -1px -1px 12px rgba(34, 211, 238, 0.25);
	}

	.welcome-corners::after {
		right: 0;
		bottom: 0;
		border-left: none;
		border-top: none;
		box-shadow: 1px 1px 12px rgba(34, 211, 238, 0.25);
	}

	:global(.welcome-dialog > button[type='button']) {
		color: rgb(165, 243, 252);
		opacity: 0.85;
	}

	:global(.welcome-dialog > button[type='button']:hover) {
		opacity: 1;
		color: rgb(207, 250, 254);
	}
</style>
