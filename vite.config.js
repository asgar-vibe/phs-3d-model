import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    host: true,
    port: 3000,
    watch: {
      ignored: ['**/idea/**', '**/*.png', '**/*.jpg']
    }
  }
});
