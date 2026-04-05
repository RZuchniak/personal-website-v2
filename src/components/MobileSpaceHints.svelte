<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { orientationPermissionNeeded } from '$lib/deviceMotion.js';

	let {
		afterWelcome = false,
		motionSteering = $bindable(false)
	}: {
		afterWelcome?: boolean;
		motionSteering?: boolean;
	} = $props();

	let portrait = $state(false);
	let coarsePointer = $state(false);
	let narrow = $state(false);
	let permissionDenied = $state(false);
	let permissionPrompting = $state(false);
	let motionPromptDismissed = $state(false);
	let browserMotionTipDismissed = $state(false);

	function readViewport() {
		if (typeof window === 'undefined') return;
		portrait = window.matchMedia('(orientation: portrait)').matches;
		coarsePointer = window.matchMedia('(pointer: coarse)').matches;
		narrow = Math.min(window.innerWidth, window.innerHeight) < 640;
	}

	$effect(() => {
		readViewport();
		const onResize = () => readViewport();
		const mqPortrait = window.matchMedia('(orientation: portrait)');
		mqPortrait.addEventListener('change', readViewport);
		window.addEventListener('resize', onResize);
		return () => {
			mqPortrait.removeEventListener('change', readViewport);
			window.removeEventListener('resize', onResize);
		};
	});

	const treatAsMobile = $derived(coarsePointer || narrow);
	const showRotateOverlay = $derived(afterWelcome && treatAsMobile && portrait);

	let motionProbeFinished = $state(false);

	const showMotionBanner = $derived(
		afterWelcome &&
			treatAsMobile &&
			!portrait &&
			orientationPermissionNeeded() &&
			!motionSteering &&
			!motionPromptDismissed &&
			motionProbeFinished
	);

	const showBrowserMotionTip = $derived(
		afterWelcome &&
			treatAsMobile &&
			!portrait &&
			!orientationPermissionNeeded() &&
			!browserMotionTipDismissed
	);

	$effect(() => {
		if (
			!afterWelcome ||
			portrait ||
			!treatAsMobile ||
			!orientationPermissionNeeded() ||
			motionPromptDismissed
		) {
			motionProbeFinished = false;
			return;
		}

		if (motionSteering) {
			motionProbeFinished = true;
			return;
		}

		motionProbeFinished = false;
		let settled = false;

		const finishProbe = () => {
			if (settled) return;
			settled = true;
			motionProbeFinished = true;
		};

		let timeoutId = 0;
		const handler = (e: DeviceOrientationEvent) => {
			if (
				e.beta != null &&
				e.gamma != null &&
				!Number.isNaN(e.beta) &&
				!Number.isNaN(e.gamma)
			) {
				window.clearTimeout(timeoutId);
				window.removeEventListener('deviceorientation', handler);
				motionSteering = true;
				finishProbe();
			}
		};

		window.addEventListener('deviceorientation', handler);
		timeoutId = window.setTimeout(() => {
			window.removeEventListener('deviceorientation', handler);
			finishProbe();
		}, 1200);

		return () => {
			window.clearTimeout(timeoutId);
			window.removeEventListener('deviceorientation', handler);
		};
	});

	function enableMotion() {
		const req = (
			DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }
		).requestPermission;

		if (typeof req !== 'function') {
			motionSteering = true;
			permissionDenied = false;
			return;
		}

		const pending = req.call(DeviceOrientationEvent);
		permissionPrompting = true;
		permissionDenied = false;

		pending
			.then((result) => {
				permissionPrompting = false;
				const ok =
					result === true ||
					(typeof result === 'string' && result.toLowerCase() === 'granted');
				if (ok) {
					motionSteering = true;
				} else {
					permissionDenied = true;
				}
			})
			.catch(() => {
				permissionPrompting = false;
				permissionDenied = true;
			});
	}
</script>

{#if showRotateOverlay}
	<div
		class="pointer-events-auto fixed inset-0 z-[45] flex flex-col items-center justify-center gap-6 bg-black/90 px-8 text-center font-sans text-cyan-100"
		role="dialog"
		aria-modal="true"
		aria-labelledby="rotate-title"
	>
		<div class="font-display text-5xl" aria-hidden="true">↻</div>
		<h2 id="rotate-title" class="font-display text-xl tracking-wide text-cyan-300 uppercase">
			Rotate your device
		</h2>
		<p class="max-w-sm text-sm leading-relaxed text-cyan-100/75">
			Landscape works best for the star map. After you rotate, try tilting your phone to look around.
			<span class="mt-2 block text-cyan-200/60">
				iPhone Safari may show a motion prompt you must tap once. Chrome on Android usually does
				not—tilt works without that popup.
			</span>
			<span class="mt-3 block text-[11px] leading-snug text-amber-200/70">
				Dev: sensors need a secure context. Plain <code class="rounded bg-black/40 px-1">http://192.168…</code>
				often blocks motion—use HTTPS on your LAN or deploy to test tilt.
			</span>
		</p>
	</div>
{/if}

{#if showMotionBanner}
	<div
		class="pointer-events-auto fixed right-3 bottom-3 left-3 z-[45] flex flex-col gap-2 rounded-md border border-cyan-500/40 bg-slate-950/95 p-3 font-sans shadow-[0_0_24px_rgba(34,211,238,0.15)] sm:right-4 sm:left-auto sm:max-w-sm"
		role="status"
	>
		<p class="text-xs leading-snug text-cyan-100/80">
			<strong class="text-cyan-300">Motion steering:</strong> tilt your phone to shift the view. On
			iPhone, you must allow motion access (one-time).
		</p>
		<div class="flex flex-wrap items-center gap-2">
			<Button
				type="button"
				size="sm"
				class="font-display bg-cyan-600 text-slate-950 hover:bg-cyan-500"
				disabled={permissionPrompting}
				on:click={enableMotion}
			>
				{permissionPrompting ? 'Requesting…' : 'Enable tilt steering'}
			</Button>
			<button
				type="button"
				class={cn(
					buttonVariants({ variant: 'ghost', size: 'sm' }),
					'text-cyan-400/80 hover:text-cyan-200'
				)}
				onclick={() => (motionPromptDismissed = true)}
			>
				Not now
			</button>
		</div>
		{#if permissionDenied}
			<p class="text-xs text-amber-300/90">
				Safari reported motion as blocked. Check Settings → Safari → Motion & Orientation Access.
				On LAN dev, use HTTPS—<code class="rounded bg-black/30 px-0.5">http://192.168…</code> is not a
				secure context and sensors may stay off.
			</p>
		{/if}
	</div>
{/if}

{#if showBrowserMotionTip}
	<div
		class="pointer-events-auto fixed right-3 bottom-3 left-3 z-[45] flex items-start gap-2 rounded-md border border-cyan-500/30 bg-slate-950/95 p-2.5 font-sans text-[11px] leading-snug text-cyan-100/80 shadow-[0_0_20px_rgba(34,211,238,0.12)] sm:right-4 sm:left-auto sm:max-w-xs"
		role="status"
	>
		<p class="min-w-0 flex-1">
			<strong class="text-cyan-300">Chrome / Android:</strong> there is often no motion popup—tilt
			should work in landscape. If nothing happens on
			<code class="rounded bg-black/30 px-0.5">http://192.168…</code>, try HTTPS or a deployed build.
		</p>
		<button
			type="button"
			class="shrink-0 rounded px-2 py-0.5 text-cyan-400/90 hover:bg-cyan-950/60 hover:text-cyan-200"
			onclick={() => (browserMotionTipDismissed = true)}
		>
			OK
		</button>
	</div>
{/if}
