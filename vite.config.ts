import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react-swc';
import observerPlugin from "mobx-react-observer/swc-plugin";
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
  plugins: [
    // Allows using React dev server along with building a React application with Vite.
    // https://npmjs.com/package/@vitejs/plugin-react-swc
    react({
      plugins: [
        observerPlugin(),
      ]
    }),
    // Allows using the compilerOptions.paths property in tsconfig.json.
    // https://www.npmjs.com/package/vite-tsconfig-paths
    tsconfigPaths(),
  ],
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        auth: resolve(__dirname, 'auth.html'),
        redirect: resolve(__dirname, 'redirect.html'),
      }
    }
  },
  publicDir: './public',
  server: {
    host: true,
		allowedHosts: true
  },
});