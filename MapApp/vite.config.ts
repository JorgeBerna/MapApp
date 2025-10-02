import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	const isProd = mode === 'production'
	// For GitHub Pages, use repository name as base when building for production.
	const base = isProd ? (env.VITE_APP_BASE_URL || '/MapApp/') : '/'

	return {
		base,
		build: {
			outDir: 'docs',
		},
		plugins: [react()],
	}
})
