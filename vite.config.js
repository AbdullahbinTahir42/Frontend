import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '', // 👈 This is the key change for addon domain
  plugins: [react()],
});
