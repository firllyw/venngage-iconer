import Fastify from 'fastify';
import cors from '@fastify/cors';
import iconsRoute from './routes/icons';
import { env } from './utils/env';
import { registerErrorHandlers } from './utils/errorHandler';

export const buildServer = () => {
  const app = Fastify({
    logger:
      env.nodeEnv === 'production'
        ? true
        : {
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
              },
            },
          },
  });

  console.log('allowedOrigins', env.allowedOrigins);
  app.register(cors, {
    origin: env.allowedOrigins,
    credentials: true,
  });

  app.get('/health', async () => ({ status: 'ok' }));

  app.register(iconsRoute, { prefix: '/api/icons' });

  registerErrorHandlers(app);

  return app;
};

export type AppServer = ReturnType<typeof buildServer>;

const start = async () => {
  const app = buildServer();
  try {
    await app.listen({ port: env.port, host: env.host });
    app.log.info(`🚀 Server ready on http://${env.host}:${env.port}`);
  } catch (error) {
    app.log.error(error, 'Failed to start server');
    process.exitCode = 1;
  }
};

if (require.main === module) {
  start();
}
