/** @type {import("prettier").Config} */
const config = {
  singleQuote: true,
  jsxSingleQuote: true,
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};

export default config;
