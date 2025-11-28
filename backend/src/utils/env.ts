import { config } from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';

const resolveEnvPath = () => {
  const customPath = process.env.ENV_FILE;
  if (customPath && existsSync(customPath)) {
    return customPath;
  }

  const fallback = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
  const potentialPath = join(process.cwd(), fallback);
  return existsSync(potentialPath) ? potentialPath : undefined;
};

const envPath = resolveEnvPath();
config(envPath ? { path: envPath } : undefined);

const parseNumber = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseCSV = (value: string | undefined, fallback: string[]) => {
  if (!value) return fallback;
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const requireEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var ${key}`);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseNumber(process.env.PORT, 4000),
  replicateApiToken: requireEnv('REPLICATE_API_TOKEN'),
  allowedOrigins: parseCSV(process.env.ALLOWED_ORIGINS, [process.env.CLIENT_BASE_URL ?? 'http://localhost:5173']),
  host: process.env.HOST ?? '0.0.0.0',
};

export type Env = typeof env;
