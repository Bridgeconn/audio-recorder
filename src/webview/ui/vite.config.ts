import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use an environment variable to specify the app to build
const appToBuild = process.env.APP_NAME;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // build: {
  //   rollupOptions: {
  //     output: {
  //       entryFileNames: 'assets/index.js',
  //       chunkFileNames: 'assets/index.js',
  //       assetFileNames: ({ name }) => {
  //         if (/\.(css|scss)$/.test(name ?? '')) {
  //           return 'assets/index.css';
  //         }
  //         return 'assets/[name].[ext]';
  //       },
  //     },
  //   },
  // },
  build : {
    rollupOptions: {
        input: `src/${appToBuild}/index.tsx`,
        output: {
            // Specify naming conventions here without a hash
            entryFileNames: `[name].js`,
            chunkFileNames: `[name].js`,
            assetFileNames: `[name].[ext]`,
        },
    },
    outDir: appToBuild ? `dist/${appToBuild}` : "dist",
},
})
