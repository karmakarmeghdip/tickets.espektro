import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { events } from "./event-schema";
import { user } from "./auth-schema";

// Ticket types (e.g., Student, Alumni, General)
export const ticketTypes = sqliteTable("ticket_types", {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  availableQuantity: integer('available_quantity'),
  maxPerUser: integer('max_per_user').default(1),
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// Individual tickets (each ticket instance sold to a user)
export const tickets = sqliteTable("tickets", {
  id: text('id').primaryKey(), // Ticket ID (like ESP2025-237849)
  ticketTypeId: text('ticket_type_id').notNull().references(() => ticketTypes.id),
  eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  transactionId: text('transaction_id').notNull(), // Reference to payment transaction
  status: text('status', { enum: ["active", "used", "cancelled", "refunded"] }).notNull(),
  qrCode: text('qr_code').notNull(),
  purchaseDate: integer('purchase_date', { mode: 'timestamp' }).notNull(),
  checkInDate: integer('check_in_date', { mode: 'timestamp' }), // Null until checked in
  checkedInBy: text('checked_in_by').references(() => user.id) // Admin who scanned the ticket
});

// Discount codes for events or specific ticket types
export const discountCodes = sqliteTable("discount_codes", {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  description: text('description'),
  eventId: text('event_id').references(() => events.id, { onDelete: 'cascade' }),
  ticketTypeId: text('ticket_type_id').references(() => ticketTypes.id),
  discountType: text('discount_type', { enum: ["percentage", "amount"] }).notNull(),
  discountValue: integer('discount_value').notNull(), // Percentage or fixed amount
  maxUses: integer('max_uses'),
  currentUses: integer('current_uses').default(0),
  startDate: integer('start_date', { mode: 'timestamp' }),
  endDate: integer('end_date', { mode: 'timestamp' }),
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// Record of discount code usage
export const discountUsage = sqliteTable("discount_usage", {
  id: text('id').primaryKey(),
  discountId: text('discount_id').notNull().references(() => discountCodes.id, { onDelete: 'cascade' }),
  ticketId: text('ticket_id').notNull().references(() => tickets.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => user.id),
  usedAt: integer('used_at', { mode: 'timestamp' }).notNull()
});