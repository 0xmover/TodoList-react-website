import { defineConfig } from 'vite';  
import react from '@vitejs/plugin-react';  
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';  
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';  

export default defineConfig({  
  plugins: [react()],  
  optimizeDeps: {  
    esbuildOptions: {  
      // Polyfill Node.js globals like 'process' and 'Buffer'  
      define: {  
        global: 'globalThis',  
      },  
      plugins: [  
        NodeGlobalsPolyfillPlugin({  
          process: true,  
          buffer: true,  
        }),  
        NodeModulesPolyfillPlugin(),  
      ],  
    },  
  },  
  resolve: {  
    alias: {  
      // This polyfill is needed for the Sui.js package  
      events: 'rollup-plugin-node-polyfills/polyfills/events',  
    },  
  },  
});