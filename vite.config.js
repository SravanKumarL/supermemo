import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            // Log the incoming request headers
            console.log('Incoming request headers:', req.headers);
            
            // Forward all headers from the original request
            Object.keys(req.headers).forEach(key => {
              if (key.toLowerCase() !== 'host') {
                proxyReq.setHeader(key, req.headers[key]);
              }
            });
            
            // Ensure the CORS header is set
            proxyReq.setHeader('anthropic-dangerous-direct-browser-access', 'true');
            
            // Log the outgoing request headers
            console.log('Outgoing request headers:', proxyReq.getHeaders());
            
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Received Response from the Target:', {
              statusCode: proxyRes.statusCode,
              url: req.url,
              headers: proxyRes.headers
            });
          });
        },
      },
    },
  },
  plugins: [react()],
});
