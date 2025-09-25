import { defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(), // JSX + Fast Refresh
    ],
    server: { 
        port: 3000,
        host: true // ← enables access via LAN 
    }
});
