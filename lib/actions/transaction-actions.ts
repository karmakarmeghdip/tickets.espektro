"use server";

import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { transactions, paymentDetails, refunds } from "@/lib/db/transaction-schema";
import { eq, and, desc } from "drizzle-orm";

// Validation schema for creating a transaction
const createTransactionSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  amount: z.number().positive("Amount must be positive"),
  paymentMethod: z.enum(["card", "upi", "netbanking", "wallet"]),
  gatewayTransactionId: z.string().min(1, "Gateway transaction ID is required"),
  gatewayResponse: z.string().optional(),
  // Payment details based on method
  cardLast4: z.string().optional(),
  cardBrand: z.string().optional(),
  upiId: z.string().optional(),
  bankName: z.string().optional(),
  walletName: z.string().optional(),
  paymentProcessor: z.string(),
  receiptUrl: z.string().optional(),
});

export async function createTransaction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { success: false, message: "User not authenticated" };
  }

  try {
    // Extract and validate form data
    const rawData: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (key === "amount") {
        rawData[key] = parseInt(value.toString(), 10);
      } else {
        rawData[key] = value.toString();
      }
    });

    const validatedData = createTransactionSchema.parse(rawData);
    const transactionId = `TXN${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
    const now = new Date();

    // Begin transaction to ensure data consistency
    await db.transaction(async (tx) => {
      // Create the transaction record
      await tx.insert(transactions).values({
        id: transactionId,
        userId: session.user.id,
        eventId: validatedData.eventId,
        amount: validatedData.amount,
        paymentMethod: validatedData.paymentMethod,
        status: "success", // Assuming payment was successful
        gatewayTransactionId: validatedData.gatewayTransactionId,
        gatewayResponse: validatedData.gatewayResponse || null,
        createdAt: now,
        updatedAt: now,
      });

      // Create payment details record
      await tx.insert(paymentDetails).values({
        id: uuidv4(),
        transactionId: transactionId,
        cardLast4: validatedData.cardLast4 || null,
        cardBrand: validatedData.cardBrand || null,
        upiId: validatedData.upiId || null,
        bankName: validatedData.bankName || null,
        walletName: validatedData.walletName || null,
        paymentProcessor: validatedData.paymentProcessor,
        receiptUrl: validatedData.receiptUrl || null,
        createdAt: now,
      });
    });

    revalidatePath("/tickets/purchased");
    return {
      success: true,
      message: "Payment processed successfully",
      transactionId: transactionId
    };
  } catch (error) {
    console.error("Transaction creation error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.format()
      };
    }

    return {
      success: false,
      message: "Failed to process payment"
    };
  }
}

// Schema for processing refunds
const refundSchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
  amount: z.number().positive("Amount must be positive"),
  reason: z.string().min(1, "Reason is required"),
  gatewayRefundId: z.string().optional(),
});

export async function processRefund(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { success: false, message: "User not authenticated" };
  }

  try {
    // Extract and validate form data
    const rawData: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (key === "amount") {
        rawData[key] = parseInt(value.toString(), 10);
      } else {
        rawData[key] = value.toString();
      }
    });

    const validatedData = refundSchema.parse(rawData);
    const now = new Date();

    // Find the transaction to refund
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, validatedData.transactionId));

    if (!transaction) {
      return { success: false, message: "Transaction not found" };
    }

    // Check if refund amount is valid
    if (validatedData.amount > transaction.amount) {
      return { success: false, message: "Refund amount cannot be greater than transaction amount" };
    }

    // Start transaction
    await db.transaction(async (tx) => {
      // Create refund record
      await tx.insert(refunds).values({
        id: `REF${Date.now().toString().slice(-6)}`,
        transactionId: validatedData.transactionId,
        amount: validatedData.amount,
        reason: validatedData.reason,
        processedBy: session.user.id,
        gatewayRefundId: validatedData.gatewayRefundId || null,
        status: "completed", // Assuming immediate completion for simplicity
        createdAt: now,
        updatedAt: now,
      });

      // Update transaction record
      const refundStatus = validatedData.amount === transaction.amount
        ? "full"
        : "partial";

      await tx.update(transactions)
        .set({
          refundStatus: refundStatus,
          refundedAmount: transaction.refundedAmount || 0 + validatedData.amount,
          updatedAt: now,
        })
        .where(eq(transactions.id, validatedData.transactionId));
    });

    revalidatePath("/admin/transactions");
    return { success: true, message: "Refund processed successfully" };
  } catch (error) {
    console.error("Refund processing error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.format()
      };
    }

    return { success: false, message: "Failed to process refund" };
  }
}

export async function getUserTransactions() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { success: false, message: "User not authenticated" };
  }

  try {
    // Get all transactions for the current user
    const userTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, session.user.id))
      .orderBy(desc(transactions.createdAt));

    return {
      success: true,
      transactions: userTransactions
    };
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return {
      success: false,
      message: "Failed to fetch transaction history"
    };
  }
}
