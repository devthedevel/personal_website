import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://devthedevel.github.io/personal_website',
	integrations: [mdx(), sitemap()],
});
