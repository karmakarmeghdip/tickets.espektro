import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";
import { events } from "./event-schema";
import { tickets } from "./ticket-schema";

// Track attendance check-ins at events
export const attendance = sqliteTable("attendance", {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  ticketId: text('ticket_id').notNull().references(() => tickets.id),
  checkedInAt: integer('checked_in_at', { mode: 'timestamp' }).notNull(),
  checkedInBy: text('checked_in_by').notNull().references(() => user.id), // Admin who did the check-in
  checkInMethod: text('check_in_method', { enum: ["qr_scan", "manual"] }).default('qr_scan').notNull(),
  checkInLocation: text('check_in_location'), // Optional location data
  verificationStatus: text('verification_status', { enum: ["success", "warning", "rejected"] }).default('success').notNull(),
  notes: text('notes') // Any special notes about the check-in
});

// For tracking multiple check-ins/check-outs at multi-day events
export const attendanceLogEntries = sqliteTable("attendance_log_entries", {
  id: text('id').primaryKey(),
  attendanceId: text('attendance_id').notNull().references(() => attendance.id, { onDelete: 'cascade' }),
  action: text('action', { enum: ["check_in", "check_out"] }).notNull(),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  processedBy: text('processed_by').references(() => user.id),
  notes: text('notes')
});

// For storing temporary QR codes with expiration for entry validation
export const temporaryAccessCodes = sqliteTable("temporary_access_codes", {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  ticketId: text('ticket_id').references(() => tickets.id),
  qrCode: text('qr_code').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  isUsed: integer('is_used', { mode: 'boolean' }).default(false).notNull()
});