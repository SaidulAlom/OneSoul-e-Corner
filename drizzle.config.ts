import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/schema.ts',
  out: './drizzle',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './data/onesoul.db',
  },
} satisfies Config;