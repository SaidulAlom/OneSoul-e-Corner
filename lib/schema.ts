import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('user'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

export const news = sqliteTable('news', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt').notNull(),
  category: text('category').notNull(),
  imageUrl: text('image_url'),
  author: text('author').notNull(),
  published: integer('published', { mode: 'boolean' }).default(false),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

export const jobs = sqliteTable('jobs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  company: text('company').notNull(),
  location: text('location').notNull(),
  type: text('type').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  requirements: text('requirements').notNull(),
  salary: text('salary'),
  applicationUrl: text('application_url'),
  applicationEmail: text('application_email'),
  deadline: text('deadline'),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  active: integer('active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

export const vlogs = sqliteTable('vlogs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description').notNull(),
  videoUrl: text('video_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  category: text('category').notNull(),
  duration: integer('duration'),
  views: integer('views').default(0),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  published: integer('published', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

export const ebooks = sqliteTable('ebooks', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  author: text('author').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  coverUrl: text('cover_url'),
  fileUrl: text('file_url'),
  fileSize: integer('file_size'),
  pages: integer('pages'),
  language: text('language').default('English'),
  price: real('price').default(0),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  available: integer('available', { mode: 'boolean' }).default(true),
  downloads: integer('downloads').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

export const serviceRequests = sqliteTable('service_requests', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  serviceType: text('service_type').notNull(),
  description: text('description').notNull(),
  urgency: text('urgency').notNull().default('medium'),
  status: text('status').notNull().default('pending'),
  estimatedCost: real('estimated_cost'),
  notes: text('notes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});