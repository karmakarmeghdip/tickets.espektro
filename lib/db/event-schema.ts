import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

export const events = sqliteTable("events", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  hostedBy: text('hosted_by').notNull(),
  location: text('location').notNull(),
  thumbnail: text('thumbnail').notNull(),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  entryFee: integer('entry_fee').default(0).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull()
});

// For event coordinators
export const eventCoordinators = sqliteTable("event_coordinators", {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  userId: text('user_id').references(() => user.id)
});

// For event categories/tags
export const eventCategories = sqliteTable("event_categories", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description')
});

// Join table for event categories
export const eventToCategoryMap = sqliteTable("event_to_category_map", {
  eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  categoryId: text('category_id').notNull().references(() => eventCategories.id, { onDelete: 'cascade' }),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.eventId, table.categoryId] }),
  };
});