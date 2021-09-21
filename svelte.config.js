import { mdsvex } from 'mdsvex';
import preprocess from 'svelte-preprocess';
import vercel from '@sveltejs/adapter-vercel'
import mdsvexConfig from './mdsvex.config.cjs';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', ...mdsvexConfig.extensions],
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    mdsvex(mdsvexConfig),
    preprocess({
      postcss: true
        // without postcss.config.cjs, <script> import css </script> not work
        // https://dev.to/swyx/how-to-set-up-svelte-with-tailwind-css-4fg5
    }),
  ],

  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    adapter: vercel()
  },
};

export default config;
