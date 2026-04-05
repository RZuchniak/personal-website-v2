/**
 * iOS Safari (13+): device orientation is gated behind a user gesture that calls
 * `DeviceOrientationEvent.requestPermission()`. The call should run immediately in the
 * click/tap handler—doing other work first (including some reactive UI updates) can
 * consume "user activation" and cause the promise to reject or resolve as denied.
 *
 * Note: `deviceorientation` and permission APIs require a **secure context** (HTTPS or
 * localhost). Plain `http://192.168.x.x` (Vite `--host` on LAN) usually blocks them.
 */
export function orientationPermissionNeeded(): boolean {
	if (typeof DeviceOrientationEvent === 'undefined') return false;
	return typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
		.requestPermission === 'function';
}
