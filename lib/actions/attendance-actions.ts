"use server";

import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import {
  attendance,
  attendanceLogEntries,
  temporaryAccessCodes
} from "@/lib/db/attendance-schema";
import { tickets } from "@/lib/db/ticket-schema";
import { eq, and, desc, isNull } from "drizzle-orm";

// Schema for checking in attendees
const checkInSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),
  eventId: z.string().min(1, "Event ID is required"),
  qrCode: z.string().min(1, "QR code is required"),
  checkInMethod: z.enum(["qr_scan", "manual"]).default("qr_scan"),
  checkInLocation: z.string().optional(),
  notes: z.string().optional(),
});

export async function checkInAttendee(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { success: false, message: "User not authenticated" };
  }

  // Check if user has admin or staff role
  // This would depend on your authentication system
  // const userRole = session.user.role;
  // if (userRole !== "admin" && userRole !== "staff") {
  //   return { success: false, message: "Unauthorized" };
  // }

  try {
    // Extract and validate form data
    const rawData: Record<string, any> = {};
    formData.forEach((value, key) => {
      rawData[key] = value.toString();
    });

    const validatedData = checkInSchema.parse(rawData);
    const now = new Date();

    // Find the ticket
    const [ticket] = await db
      .select()
      .from(tickets)
      .where(
        and(
          eq(tickets.id, validatedData.ticketId),
          eq(tickets.eventId, validatedData.eventId),
          eq(tickets.qrCode, validatedData.qrCode),
          eq(tickets.status, "active")
        )
      );

    if (!ticket) {
      return { success: false, message: "Invalid or used ticket" };
    }

    // Check if already checked in
    const [existingAttendance] = await db
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.ticketId, validatedData.ticketId),
          eq(attendance.eventId, validatedData.eventId)
        )
      );

    if (existingAttendance) {
      return { success: false, message: "Attendee already checked in" };
    }

    // Begin transaction to ensure data consistency
    await db.transaction(async (tx) => {
      // Create attendance record
      const attendanceId = uuidv4();

      await tx.insert(attendance).values({
        id: attendanceId,
        eventId: validatedData.eventId,
        userId: ticket.userId,
        ticketId: ticket.id,
        checkedInAt: now,
        checkedInBy: session.user.id,
        checkInMethod: validatedData.checkInMethod,
        checkInLocation: validatedData.checkInLocation || null,
        verificationStatus: "success",
        notes: validatedData.notes || null,
      });

      // Create log entry
      await tx.insert(attendanceLogEntries).values({
        id: uuidv4(),
        attendanceId: attendanceId,
        action: "check_in",
        timestamp: now,
        processedBy: session.user.id,
        notes: `Initial check-in: ${validatedData.notes || "No notes"}`,
      });

      // Update ticket status
      await tx
        .update(tickets)
        .set({
          status: "used",
          checkInDate: now,
          checkedInBy: session.user.id,
        })
        .where(eq(tickets.id, validatedData.ticketId));
    });

    revalidatePath("/admin/attendance");
    return {
      success: true,
      message: "Attendee checked in successfully"
    };
  } catch (error) {
    console.error("Check-in error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.format()
      };
    }

    return { success: false, message: "Failed to check in attendee" };
  }
}

// Schema for generating temporary access codes
const generateAccessCodeSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  ticketId: z.string().optional(),
  expirationMinutes: z.number().int().min(5).max(60).default(15),
});

export async function generateTemporaryAccessCode(formData: FormData) {
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
      if (key === "expirationMinutes") {
        rawData[key] = parseInt(value.toString(), 10);
      } else {
        rawData[key] = value.toString();
      }
    });

    const validatedData = generateAccessCodeSchema.parse(rawData);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (validatedData.expirationMinutes * 60 * 1000));

    // Check if ticket exists and belongs to user (if ticketId provided)
    if (validatedData.ticketId) {
      const [ticket] = await db
        .select()
        .from(tickets)
        .where(
          and(
            eq(tickets.id, validatedData.ticketId),
            eq(tickets.userId, session.user.id),
            eq(tickets.status, "active")
          )
        );

      if (!ticket) {
        return { success: false, message: "Invalid ticket" };
      }
    }

    // Delete any existing unexpired access codes for this user/event
    await db
      .delete(temporaryAccessCodes)
      .where(
        and(
          eq(temporaryAccessCodes.userId, session.user.id),
          eq(temporaryAccessCodes.eventId, validatedData.eventId)
        )
      );

    // Generate new QR code
    const qrCode = `${session.user.id.slice(-6)}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;

    // Create new temporary access code
    await db.insert(temporaryAccessCodes).values({
      id: uuidv4(),
      userId: session.user.id,
      eventId: validatedData.eventId,
      ticketId: validatedData.ticketId || null,
      qrCode: qrCode,
      createdAt: now,
      expiresAt: expiresAt,
      isUsed: false,
    });

    return {
      success: true,
      accessCode: qrCode,
      expiresAt: expiresAt
    };
  } catch (error) {
    console.error("Access code generation error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.format()
      };
    }

    return { success: false, message: "Failed to generate access code" };
  }
}

// Schema for verifying temporary access codes
const verifyAccessCodeSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  qrCode: z.string().min(1, "QR code is required"),
});

export async function verifyAccessCode(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { success: false, message: "User not authenticated" };
  }

  // Check if user has admin or staff role
  // const userRole = session.user.role;
  // if (userRole !== "admin" && userRole !== "staff") {
  //   return { success: false, message: "Unauthorized" };
  // }

  try {
    // Extract and validate form data
    const rawData: Record<string, any> = {};
    formData.forEach((value, key) => {
      rawData[key] = value.toString();
    });

    const validatedData = verifyAccessCodeSchema.parse(rawData);
    const now = new Date();

    // Find the access code
    const [accessCode] = await db
      .select()
      .from(temporaryAccessCodes)
      .where(
        and(
          eq(temporaryAccessCodes.eventId, validatedData.eventId),
          eq(temporaryAccessCodes.qrCode, validatedData.qrCode),
          eq(temporaryAccessCodes.isUsed, false)
        )
      );

    if (!accessCode) {
      return { success: false, message: "Invalid access code" };
    }

    // Check if code has expired
    if (accessCode.expiresAt < now) {
      return { success: false, message: "Access code has expired" };
    }

    // Mark code as used
    await db
      .update(temporaryAccessCodes)
      .set({ isUsed: true })
      .where(eq(temporaryAccessCodes.id, accessCode.id));

    // Get attendee information
    let ticketDetails = null;

    if (accessCode.ticketId) {
      const [ticket] = await db
        .select()
        .from(tickets)
        .where(eq(tickets.id, accessCode.ticketId));

      ticketDetails = ticket;
    }

    return {
      success: true,
      message: "Access code verified successfully",
      userId: accessCode.userId,
      ticketId: accessCode.ticketId,
      ticketDetails: ticketDetails
    };
  } catch (error) {
    console.error("Access code verification error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error.format()
      };
    }

    return { success: false, message: "Failed to verify access code" };
  }
}

export async function getEventAttendance(eventId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { success: false, message: "User not authenticated" };
  }

  try {
    // Get attendance records for the event
    const attendanceRecords = await db
      .select()
      .from(attendance)
      .where(eq(attendance.eventId, eventId))
      .orderBy(desc(attendance.checkedInAt));

    return {
      success: true,
      attendanceCount: attendanceRecords.length,
      attendanceRecords: attendanceRecords
    };
  } catch (error) {
    console.error("Error fetching event attendance:", error);
    return {
      success: false,
      message: "Failed to fetch attendance records"
    };
  }
}
