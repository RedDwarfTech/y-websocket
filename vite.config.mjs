import { defineConfig } from "vite";
import path from 'path';

export default defineConfig({
    plugins: [],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/y-websocket.ts'),
            name: 'MyLib',
            fileName: (format) => `y-websocket.${format}.js`
        }
    }
});