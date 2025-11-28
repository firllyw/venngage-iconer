import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError, type ZodIssue } from 'zod';
import { AppError, isAppError } from './errors';

const formatZodError = (error: ZodError) =>
  error.issues.map((issue: ZodIssue) => ({
    path: issue.path.join('.') || undefined,
    code: issue.code,
    message: issue.message,
  }));

export const registerErrorHandlers = (app: FastifyInstance) => {
  app.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    reply.status(404).send({
      message: `Route ${request.method}:${request.url} not found`,
    });
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: 'Validation error',
        details: formatZodError(error),
      });
    }

    if (isAppError(error)) {
      return reply.status(error.statusCode).send({
        message: error.message,
        details: error.details,
      });
    }

    app.log.error(error, 'Unhandled error');
    return reply.status(500).send({
      message: 'Internal Server Error',
    });
  });
};

export const createValidationError = (details: unknown) =>
  new AppError({
    message: 'Request validation failed',
    statusCode: 400,
    details,
  });
