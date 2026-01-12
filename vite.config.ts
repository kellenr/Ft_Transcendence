import { sveltekit } from '@sveltejs/kit/vite';  // SvelteKit plugin for Vite
import { defineConfig } from 'vite';              // Type-safe config helper

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    // o
	// https: false,
    port: 8081,
    host: true
  },
  preview: {
    port: 8081,
    host: true
  }
});
