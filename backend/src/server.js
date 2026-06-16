import http from 'http';
import app from './app.js';
import config from './config/index.js';
import { initializeSocket } from './sockets/index.js';

const server = http.createServer(app);

initializeSocket(server);

server.listen(config.port, () => {
  console.log(`\n🚀 CEDIG Backend API`);
  console.log(`📡 Server: ${config.apiUrl}`);
  console.log(`📚 API Docs: ${config.apiUrl}/api-docs`);
  console.log(`🏥 Health: ${config.apiUrl}/health`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`\n`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

export default server;
