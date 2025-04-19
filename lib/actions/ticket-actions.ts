"use server";

import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { transactions } from "@/lib/db/transaction-schema";
import { tickets, ticketTypes, discountCodes, discountUsage } from "@/lib/db/ticket-schema";
import { eq, and, desc, lt, sql, gt } from "drizzle-orm";

// Schema for purchasing tickets
const purchaseTicketSchema = z.object({
  ticketTypeId: z.string().min(1, "Ticket type is required"),
  eventId: z.string().min(1, "Event ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  discountCode: z.string().optional(),
  transactionId: z.string().min(1, "Transaction ID is required"),
});

export async function purchaseTicket(formData: FormData) {
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
      if (key === "quantity") {
        rawData[key] = parseInt(value.toString(), 10);
      } else {
        rawData[key] = value.toString();
      }
    });

    const validatedData = purchaseTicketSchema.parse(rawData);
    const now = new Date();

    // Find the ticket type
    const [ticketType] = await db
      .select()
      .from(ticketTypes)
      .where(
        and(
          eq(ticketTypes.id, validatedData.ticketTypeId),
          eq(ticketTypes.isActive, true)
        )
      );

    if (!ticketType) {
      return { success: false, message: "Ticket type not found or not available" };
    }

    // Check quantity availability
    if (ticketType.availableQuantity !== null &&
      validatedData.quantity > ticketType.availableQuantity) {
      return { success: false, message: "Not enough tickets available" };
    }

    // Check max per user limit
    if (ticketType.maxPerUser && validatedData.quantity > ticketType.maxPerUser) {
      return {
        success: false,
        message: `You can only purchase up to ${ticketType.maxPerUser} tickets of this type`
      };
    }

    // Verify discount code if provided
    let discountRecord = null;
    let discountValue = 0;

    if (validatedData.discountCode) {
      [discountRecord] = await db
        .select()
        .from(discountCodes)
        .where(
          and(
            eq(discountCodes.code, validatedData.discountCode),
            eq(discountCodes.isActive, true),
            lt(discountCodes.startDate || new Date(0), now),
            gt(discountCodes.endDate || new Date(9999, 0), now)
          )
        );

      if (!discountRecord) {
        return { success: false, message: "Invalid or expired discount code" };
      }

      // Check if discount is applicable to this ticket type
      if (discountRecord.ticketTypeId &&
        discountRecord.ticketTypeId !== validatedData.ticketTypeId) {
        return { success: false, message: "Discount code not applicable to this ticket type" };
      }

      // Check if discount is applicable to this event
      if (discountRecord.eventId &&
        discountRecord.eventId !== validatedData.eventId) {
        return { success: false, message: "Discount code not applicable to this event" };
      }

      // Check usage limits
      if (discountRecord.maxUses !== null && discountRecord.currentUses &&
        discountRecord.currentUses >= discountRecord.maxUses) {
        return { success: false, message: "Discount code usage limit reached" };
      }

      // Calculate discount value
      if (discountRecord.discountType === "percentage") {
        discountValue = (ticketType.price * discountRecord.discountValue) / 100;
      } else {
        discountValue = discountRecord.discountValue;
      }
    }

    // Begin transaction to ensure data consistency
    const purchasedTickets = await db.transaction(async (tx) => {
      // Update ticket availability if needed
      if (ticketType.availableQuantity !== null) {
        await tx
          .update(ticketTypes)
          .set({
            availableQuantity: ticketType.availableQuantity - validatedData.quantity,
            updatedAt: now,
          })
          .where(eq(ticketTypes.id, validatedData.ticketTypeId));
      }

      // Create ticket records
      const ticketIds = [];

      for (let i = 0; i < validatedData.quantity; i++) {
        const ticketId = `ESP${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        const qrCode = `${ticketId}-${uuidv4().slice(0, 8)}`;

        await tx.insert(tickets).values({
          id: ticketId,
          ticketTypeId: validatedData.ticketTypeId,
          eventId: validatedData.eventId,
          userId: session.user.id,
          transactionId: validatedData.transactionId,
          status: "active",
          qrCode: qrCode,
          purchaseDate: now,
        });

        ticketIds.push(ticketId);

        // Apply discount if available
        if (discountRecord) {
          await tx.insert(discountUsage).values({
            id: uuidv4(),
            discountId: discountRecord.id,
            ticketId: ticketId,
            userId: session.user.id,
            usedAt: now,
          });
        }
      }

      // Update discount code usage if used
      if (discountRecord) {
        await tx
          .update(discountCodes)
          .set({
            currentUses: (discountRecord.currentUses || 0) + validatedData.quantity,
            updatedAt: now,
          })
          .where(eq(discountCodes.id, discountRecord.id));
      }

      return ticketIds;
    });

    revalidatePath("/tickets/purchased");
    return {
      success: true,
      message: "Tickets purchased successfully",
      ticketIds: purchasedTickets
    };
  } catch (error) {
    console.error("Ticket purchase error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.format()
      };
    }

    return { success: false, message: "Failed to purchase tickets" };
  }
}

// Schema for validating discount codes
const validateDiscountSchema = z.object({
  code: z.string().min(1, "Discount code is required"),
  ticketTypeId: z.string().min(1, "Ticket type is required"),
  eventId: z.string().min(1, "Event ID is required"),
});

export async function validateDiscountCode(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { success: false, message: "User not authenticated" };
  }

  try {
    const rawData: Record<string, any> = {};
    formData.forEach((value, key) => {
      rawData[key] = value.toString();
    });

    const validatedData = validateDiscountSchema.parse(rawData);
    const now = new Date();

    // Find the discount code
    const [discountCode] = await db
      .select()
      .from(discountCodes)
      .where(
        and(
          eq(discountCodes.code, validatedData.code),
          eq(discountCodes.isActive, true),
          lt(discountCodes.startDate || new Date(0), now),
          gt(discountCodes.endDate || new Date(9999, 0), now)
        )
      );

    if (!discountCode) {
      return { success: false, message: "Invalid or expired discount code" };
    }

    // Check if discount is applicable to this ticket type
    if (discountCode.ticketTypeId &&
      discountCode.ticketTypeId !== validatedData.ticketTypeId) {
      return { success: false, message: "Discount code not applicable to this ticket type" };
    }

    // Check if discount is applicable to this event
    if (discountCode.eventId &&
      discountCode.eventId !== validatedData.eventId) {
      return { success: false, message: "Discount code not applicable to this event" };
    }

    // Check usage limits
    if (discountCode.maxUses !== null && discountCode.currentUses &&
      discountCode.currentUses >= discountCode.maxUses) {
      return { success: false, message: "Discount code usage limit reached" };
    }

    // Get ticket type info for price calculation
    const [ticketType] = await db
      .select()
      .from(ticketTypes)
      .where(eq(ticketTypes.id, validatedData.ticketTypeId));

    if (!ticketType) {
      return { success: false, message: "Ticket type not found" };
    }

    // Calculate discount
    let discountAmount = 0;
    let discountedPrice = ticketType.price;

    if (discountCode.discountType === "percentage") {
      discountAmount = Math.round((ticketType.price * discountCode.discountValue) / 100);
    } else {
      discountAmount = discountCode.discountValue;
    }

    discountedPrice = Math.max(0, ticketType.price - discountAmount);

    return {
      success: true,
      discount: {
        code: discountCode.code,
        description: discountCode.description,
        discountType: discountCode.discountType,
        discountValue: discountCode.discountValue,
        discountAmount: discountAmount,
        originalPrice: ticketType.price,
        discountedPrice: discountedPrice
      }
    };
  } catch (error) {
    console.error("Discount validation error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.format()
      };
    }

    return { success: false, message: "Failed to validate discount code" };
  }
}

export async function getUserTickets() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { success: false, message: "User not authenticated" };
  }

  try {
    // Get all active tickets for the user
    const userTickets = await db
      .select({
        ticket: tickets,
        ticketType: {
          name: ticketTypes.name,
          description: ticketTypes.description,
          price: ticketTypes.price
        }
      })
      .from(tickets)
      .innerJoin(ticketTypes, eq(tickets.ticketTypeId, ticketTypes.id))
      .where(
        and(
          eq(tickets.userId, session.user.id),
          eq(tickets.status, "active")
        )
      )
      .orderBy(desc(tickets.purchaseDate));

    return {
      success: true,
      tickets: userTickets
    };
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    return {
      success: false,
      message: "Failed to fetch tickets"
    };
  }
}
