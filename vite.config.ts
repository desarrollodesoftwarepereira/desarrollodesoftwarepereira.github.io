import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    base: env.VITE_BASE_PATH || '/',
    build: {
      target: 'es2019',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Separa los módulos de node_modules en chunks individuales
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Group React core + packages that call React APIs at module init time
              // into one chunk to guarantee load order in production
              if (
                id.includes('/react/') ||
                id.includes('/react-dom/') ||
                id.includes('/scheduler/') ||
                id.includes('/its-fine/')
              ) {
                return 'react-vendor';
              }
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString();
            }
          },
        },
      },
    },
    server: {
      host: true,
      allowedHosts: ['desarrollodesoftwarepereira.github.io'],
    },
  };
});
