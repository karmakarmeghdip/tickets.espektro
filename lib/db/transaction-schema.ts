import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";
import { events } from "./event-schema";

// Main transactions table
export const transactions = sqliteTable("transactions", {
  id: text('id').primaryKey(), // Transaction ID like TXN1234567
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  eventId: text('event_id').notNull().references(() => events.id),
  amount: integer('amount').notNull(), // Total amount in paise (₹100 = 10000 paise)
  paymentMethod: text('payment_method', { enum: ["card", "upi", "netbanking", "wallet"] }).notNull(),
  status: text('status', { enum: ["pending", "success", "failed", "refunded"] }).notNull(),
  gatewayTransactionId: text('gateway_transaction_id'), // ID from payment gateway
  gatewayResponse: text('gateway_response'), // Response from payment gateway
  refundStatus: text('refund_status', { enum: ["none", "partial", "full"] }).default('none').notNull(),
  refundedAmount: integer('refunded_amount').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// Payment details for each transaction
export const paymentDetails = sqliteTable("payment_details", {
  id: text('id').primaryKey(),
  transactionId: text('transaction_id').notNull().references(() => transactions.id, { onDelete: 'cascade' }),
  cardLast4: text('card_last_4'), // Last 4 digits of card
  cardBrand: text('card_brand'), // Visa, Mastercard, etc.
  upiId: text('upi_id'), // UPI ID used for payment
  bankName: text('bank_name'), // Bank used for netbanking
  walletName: text('wallet_name'), // Wallet provider
  paymentProcessor: text('payment_processor').notNull(), // Razorpay, Stripe, etc.
  receiptUrl: text('receipt_url'), // URL to payment receipt
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

// Refund records
export const refunds = sqliteTable("refunds", {
  id: text('id').primaryKey(),
  transactionId: text('transaction_id').notNull().references(() => transactions.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  reason: text('reason').notNull(),
  processedBy: text('processed_by').references(() => user.id),
  gatewayRefundId: text('gateway_refund_id'),
  status: text('status', { enum: ["processing", "completed", "failed"] }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});