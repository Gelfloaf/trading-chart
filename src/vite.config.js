import { defineConfig } from 'vite';

export default defineConfig({
	root: './src/example',
	publicDir: '../../public',
	build: {
		outDir: '../../dist',
		emptyOutDir: true,
	},
	server: {
		port: 5173,
		host: true,
	},
	optimizeDeps: {
		include: ['lightweight-charts'],
	},
});
