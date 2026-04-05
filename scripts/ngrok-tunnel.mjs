/**
 * Opens an HTTPS tunnel to the local Vite dev server (default port 5173).
 * Requires NGROK_AUTHTOKEN (see https://dashboard.ngrok.com/get-started/your-authtoken).
 *
 * Usage:
 *   1. Terminal A: pnpm dev
 *   2. Terminal B: pnpm tunnel
 *   Open the printed https:// URL on your phone.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ngrok from '@ngrok/ngrok';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

function loadTokenFromDotenv() {
	try {
		const envPath = path.join(projectRoot, '.env');
		if (!fs.existsSync(envPath)) return;
		const text = fs.readFileSync(envPath, 'utf8');
		for (const line of text.split('\n')) {
			const s = line.trim();
			if (!s || s.startsWith('#')) continue;
			const m = s.match(/^NGROK_AUTHTOKEN\s*=\s*(.*)$/);
			if (!m) continue;
			let v = m[1].trim();
			if (
				(v.startsWith('"') && v.endsWith('"')) ||
				(v.startsWith("'") && v.endsWith("'"))
			) {
				v = v.slice(1, -1);
			}
			if (v && !process.env.NGROK_AUTHTOKEN) process.env.NGROK_AUTHTOKEN = v;
			break;
		}
	} catch {
		/* ignore */
	}
}

loadTokenFromDotenv();

const port = Number(process.env.PORT ?? 5173);

if (!process.env.NGROK_AUTHTOKEN) {
	console.error(`
Missing NGROK_AUTHTOKEN.

1. Sign up at https://ngrok.com and copy your authtoken from the dashboard.
2. Add to .env (see .env.example) or export in this shell:

   export NGROK_AUTHTOKEN=your_token_here

Then run: pnpm tunnel
`);
	process.exit(1);
}

try {
	const listener = await ngrok.forward({
		addr: port,
		authtoken_from_env: true
	});

	console.log(`
  Tunnel ready → http://localhost:${port}
  Public URL:  ${listener.url()}

  Keep this process running. Use the https URL on your phone (motion APIs need HTTPS).
`);
	process.stdin.resume();
} catch (err) {
	console.error(err);
	process.exit(1);
}
