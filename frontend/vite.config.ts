import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'next/link': path.resolve(__dirname, 'src/compat/next.tsx'),
      'next/image': path.resolve(__dirname, 'src/compat/next.tsx'),
      'next/navigation': path.resolve(__dirname, 'src/compat/next.tsx'),
    },
  },
  server: {
    port: parseInt(process.env.VITE_PORT || '5173'),
    strictPort: false,
  },
});
