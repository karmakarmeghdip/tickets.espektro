"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { events, eventCoordinators, eventCategories, eventToCategoryMap } from "@/lib/db/event-schema";

import { eq, and, desc, sql, like, gte } from "drizzle-orm";
import { APIError } from "better-auth/api";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// Check if current user is admin or event manager
async function checkUserAdmin() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  if (!session) {
    throw new APIError("UNAUTHORIZED", { message: "Unauthorized" });
  }
  if (session.user.role !== "admin" && session.user.role !== "event_manager") {
    throw new APIError("FORBIDDEN", { message: "Forbidden" });
  }
  return session.user;
}

// Create a new event
export async function createEvent(
  eventData: {
    name: string;
    description: string;
    hostedBy: string;
    location: string;
    thumbnail: string;
    startDate: Date;
    endDate: Date;
    entryFee?: number;
    coordinators?: Array<{
      name: string;
      phone: string;
      email?: string;
      userId?: string;
    }>;
    categories?: string[]; // Array of category IDs
  }
) {
  const user = await checkUserAdmin();

  // Validate dates
  if (new Date(eventData.startDate) >= new Date(eventData.endDate)) {
    throw new APIError("BAD_REQUEST", { message: "End date must be after start date" });
  }

  const eventId = uuidv4();

  try {
    await db.transaction(async (tx) => {
      // Create event
      await tx.insert(events).values({
        id: eventId,
        name: eventData.name,
        description: eventData.description,
        hostedBy: eventData.hostedBy,
        location: eventData.location,
        thumbnail: eventData.thumbnail,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        entryFee: eventData.entryFee || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      });

      // Add coordinators if provided
      if (eventData.coordinators && eventData.coordinators.length > 0) {
        await tx.insert(eventCoordinators).values(
          eventData.coordinators.map(coordinator => ({
            id: uuidv4(),
            eventId,
            name: coordinator.name,
            phone: coordinator.phone,
            email: coordinator.email || null,
            userId: coordinator.userId || null
          }))
        );
      }

      // Add categories if provided
      if (eventData.categories && eventData.categories.length > 0) {
        await tx.insert(eventToCategoryMap).values(
          eventData.categories.map(categoryId => ({
            eventId,
            categoryId
          }))
        );
      }
    });

    revalidatePath("/events");
    return { id: eventId, success: true };
  } catch (error) {
    console.error("Failed to create event:", error);
    throw new APIError("INTERNAL_SERVER_ERROR", { message: "Failed to create event" });
  }
}

// Update an event
export async function updateEvent(
  eventId: string,
  eventData: {
    name?: string;
    description?: string;
    hostedBy?: string;
    location?: string;
    thumbnail?: string;
    startDate?: Date;
    endDate?: Date;
    entryFee?: number;
    isActive?: boolean;
  }
) {
  await checkUserAdmin();

  // Check if event exists
  const existingEvent = await db.query.events.findFirst({
    where: eq(events.id, eventId)
  });

  if (!existingEvent) {
    throw new APIError("NOT_FOUND", { message: "Event not found" });
  }

  // Validate dates if both are provided
  if (eventData.startDate && eventData.endDate &&
    new Date(eventData.startDate) >= new Date(eventData.endDate)) {
    throw new APIError("BAD_REQUEST", { message: "End date must be after start date" });
  }

  try {
    await db.update(events)
      .set({
        ...eventData,
        updatedAt: new Date()
      })
      .where(eq(events.id, eventId));

    revalidatePath("/events");
    revalidatePath(`/events/${eventId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update event:", error);
    throw new APIError("INTERNAL_SERVER_ERROR", { message: "Failed to update event" });
  }
}

// Delete an event
export async function deleteEvent(eventId: string) {
  await checkUserAdmin();

  // Check if event exists
  const existingEvent = await db.query.events.findFirst({
    where: eq(events.id, eventId)
  });

  if (!existingEvent) {
    throw new APIError("NOT_FOUND", { message: "Event not found" });
  }

  try {
    await db.delete(events).where(eq(events.id, eventId));

    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete event:", error);
    throw new APIError("INTERNAL_SERVER_ERROR", { message: "Failed to delete event" });
  }
}

// Get a single event with its details
export async function getEvent(eventId: string) {
  try {
    // Get the event
    const event = await db.query.events.findFirst({
      where: eq(events.id, eventId)
    });

    if (!event) {
      throw new APIError("NOT_FOUND", { message: "Event not found" });
    }

    // Get event coordinators
    const coordinators = await db.query.eventCoordinators.findMany({
      where: eq(eventCoordinators.eventId, eventId)
    });

    // Get event categories
    const categoriesMap = await db.select({
      category: eventCategories
    })
      .from(eventToCategoryMap)
      .innerJoin(eventCategories, eq(eventToCategoryMap.categoryId, eventCategories.id))
      .where(eq(eventToCategoryMap.eventId, eventId));

    return {
      ...event,
      coordinators,
      categories: categoriesMap.map(item => item.category)
    };
  } catch (error) {
    console.error("Failed to get event:", error);
    throw new APIError("INTERNAL_SERVER_ERROR", { message: "Failed to get event details" });
  }
}

// List events with filtering and pagination
export async function listEvents({
  page = 1,
  limit = 10,
  search = "",
  categoryId = "",
  upcoming = false
}: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  upcoming?: boolean;
} = {}) {
  try {
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];

    // Add search condition if provided
    if (search) {
      conditions.push(like(events.name, `%${search}%`));
    }

    // Filter for upcoming events if requested
    if (upcoming) {
      conditions.push(gte(events.startDate, new Date()));
    }

    // Base query for events with proper typing
    let query = db.select().from(events);

    // Apply conditions if any, preserving the type
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply pagination
    query = query.limit(limit).offset(offset).orderBy(desc(events.startDate));

    // Execute query
    const results = await query;

    // If category filter is applied, filter the results
    if (categoryId) {
      const eventIdsInCategory = await db.select({ eventId: eventToCategoryMap.eventId })
        .from(eventToCategoryMap)
        .where(eq(eventToCategoryMap.categoryId, categoryId));

      const eventIdSet = new Set(eventIdsInCategory.map(e => e.eventId));
      return results.filter(event => eventIdSet.has(event.id));
    }

    // Get total count for pagination
    const totalCount = await db.select({ count: sql<number>`count(*)` })
      .from(events)
      .then(res => res[0].count);

    return {
      events: results,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  } catch (error) {
    console.error("Failed to list events:", error);
    throw new APIError("INTERNAL_SERVER_ERROR", { message: "Failed to list events" });
  }
}

// Manage event coordinators
export async function updateEventCoordinators(
  eventId: string,
  coordinators: Array<{
    id?: string; // If updating existing coordinator
    name: string;
    phone: string;
    email?: string;
    userId?: string;
  }>
) {
  await checkUserAdmin();

  // Check if event exists
  const existingEvent = await db.query.events.findFirst({
    where: eq(events.id, eventId)
  });

  if (!existingEvent) {
    throw new APIError("NOT_FOUND", { message: "Event not found" });
  }

  try {
    await db.transaction(async (tx) => {
      // Delete existing coordinators
      await tx.delete(eventCoordinators).where(eq(eventCoordinators.eventId, eventId));

      // Add new coordinators
      await tx.insert(eventCoordinators).values(
        coordinators.map(coordinator => ({
          id: coordinator.id || uuidv4(),
          eventId,
          name: coordinator.name,
          phone: coordinator.phone,
          email: coordinator.email || null,
          userId: coordinator.userId || null
        }))
      );
    });

    revalidatePath(`/events/${eventId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update event coordinators:", error);
    throw new APIError("INTERNAL_SERVER_ERROR", { message: "Failed to update event coordinators" });
  }
}

// Manage event categories
export async function updateEventCategories(
  eventId: string,
  categoryIds: string[]
) {
  await checkUserAdmin();

  // Check if event exists
  const existingEvent = await db.query.events.findFirst({
    where: eq(events.id, eventId)
  });

  if (!existingEvent) {
    throw new APIError("NOT_FOUND", { message: "Event not found" });
  }

  try {
    await db.transaction(async (tx) => {
      // Delete existing category mappings
      await tx.delete(eventToCategoryMap).where(eq(eventToCategoryMap.eventId, eventId));

      // Add new category mappings
      if (categoryIds.length > 0) {
        await tx.insert(eventToCategoryMap).values(
          categoryIds.map(categoryId => ({
            eventId,
            categoryId
          }))
        );
      }
    });

    revalidatePath(`/events/${eventId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update event categories:", error);
    throw new APIError("INTERNAL_SERVER_ERROR", { message: "Failed to update event categories" });
  }
}

// CRUD for event categories
export async function createEventCategory(
  { name, description }: { name: string; description?: string }
) {
  await checkUserAdmin();

  const categoryId = uuidv4();

  try {
    await db.insert(eventCategories).values({
      id: categoryId,
      name,
      description: description || null
    });

    revalidatePath("/admin/events/categories");
    return { id: categoryId, success: true };
  } catch (error) {
    console.error("Failed to create event category:", error);
    throw new APIError("INTERNAL_SERVER_ERROR", { message: "Failed to create event category" });
  }
}

export async function listEventCategories() {
  try {
    return await db.query.eventCategories.findMany();
  } catch (error) {
    console.error("Failed to list event categories:", error);
    throw new APIError("INTERNAL_SERVER_ERROR", { message: "Failed to list event categories" });
  }
}

export async function deleteEventCategory(categoryId: string) {
  await checkUserAdmin();

  try {
    await db.delete(eventCategories).where(eq(eventCategories.id, categoryId));
    revalidatePath("/admin/events/categories");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete event category:", error);
    throw new APIError("INTERNAL_SERVER_ERROR", { message: "Failed to delete event category" });
  }
}

// Create dummy events for testing
export async function createDummyEvents(count: number = 5) {
  await checkUserAdmin();

  const categories = ["Music", "Tech", "Sports", "Art", "Food"];
  const locations = ["Auditorium", "Conference Hall", "Stadium", "Gallery", "Food Court"];

  try {
    // First create categories if they don't exist
    for (const categoryName of categories) {
      const existingCategory = await db.query.eventCategories.findFirst({
        where: eq(eventCategories.name, categoryName)
      });

      if (!existingCategory) {
        await db.insert(eventCategories).values({
          id: uuidv4(),
          name: categoryName,
          description: `Events related to ${categoryName}`
        });
      }
    }

    // Get all category IDs
    const allCategories = await db.query.eventCategories.findMany();

    // Create dummy events
    for (let i = 0; i < count; i++) {
      const eventId = uuidv4();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30)); // Random date in next 30 days

      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + Math.floor(Math.random() * 8) + 2); // 2-10 hours after start

      // Create event
      await db.insert(events).values({
        id: eventId,
        name: `Dummy Event ${i + 1}`,
        description: `This is a description for dummy event ${i + 1}`,
        hostedBy: `Organization ${i % 3 + 1}`,
        location: locations[i % locations.length],
        thumbnail: `https://picsum.photos/seed/${i}/800/600`,
        startDate,
        endDate,
        entryFee: Math.floor(Math.random() * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      });

      // Add 1-2 coordinators
      await db.insert(eventCoordinators).values([
        {
          id: uuidv4(),
          eventId,
          name: `Coordinator ${i + 1}`,
          phone: `555-000-${1000 + i}`,
          email: `coordinator${i + 1}@example.com`,
          userId: null
        },
        {
          id: uuidv4(),
          eventId,
          name: `Assistant ${i + 1}`,
          phone: `555-100-${1000 + i}`,
          email: null,
          userId: null
        }
      ]);

      // Assign 1-3 random categories
      const categoryCount = Math.floor(Math.random() * 3) + 1;
      const selectedCategories = new Set();

      while (selectedCategories.size < categoryCount && selectedCategories.size < allCategories.length) {
        const randomIndex = Math.floor(Math.random() * allCategories.length);
        selectedCategories.add(allCategories[randomIndex].id);
      }

      await db.insert(eventToCategoryMap).values(
        Array.from(selectedCategories).map(categoryId => ({
          eventId,
          categoryId: categoryId as string
        }))
      );
    }

    revalidatePath("/events");
    return { success: true, count };
  } catch (error) {
    console.error("Failed to create dummy events:", error);
    throw new APIError("INTERNAL_SERVER_ERROR", { message: "Failed to create dummy events" });
  }
}
