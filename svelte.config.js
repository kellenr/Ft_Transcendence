import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {

  preprocess: vitePreprocess(),
  kit: {

    adapter: adapter({
      out: 'build',           // Output directory for production build
      precompress: false,     // Don't pre-compress (let nginx/proxy do it)
      envPrefix: ''           // No prefix for env vars
    }),
    csrf: {
      trustedOrigins: []
    },
    alias: {
      $components: 'src/lib/components',  // UI components
      $server: 'src/lib/server',          // Server-only code (DB, auth)
      $stores: 'src/lib/stores'           // Svelte stores (state)
    }
  }
};

// Export the configuration
export default config;
