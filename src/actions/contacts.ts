"use server";

import { stackServerApp } from "@/stack";
import { db } from "@/db";
import { contactsTable } from "@/schema";
import { and, eq } from "drizzle-orm";
import type { CreateContact, UpdateContact, Contact } from "@/schema";

export async function createContactAction(data: CreateContact) {
  try {
    const user = await stackServerApp.getUser({ or: "throw" });

    const now = new Date();
    const newContact = {
      ...data,
      userId: user.id,
      createdAt: now,
      updatedAt: now,
    };

    const [insertedContact] = await db
      .insert(contactsTable)
      .values(newContact)
      .returning();

    return {
      success: true,
      contact: insertedContact,
    };
  } catch (error) {
    console.error("Error creating contact:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create contact",
    };
  }
}

export async function updateContactAction(id: string, data: UpdateContact) {
  try {
    const user = await stackServerApp.getUser({ or: "throw" });

    const updateData = {
      ...data,
      userId: user.id,
      updatedAt: new Date(),
    };

    const [updatedContact] = await db
      .update(contactsTable)
      .set(updateData)
      .where(and(eq(contactsTable.id, id), eq(contactsTable.userId, user.id)))
      .returning();

    if (!updatedContact) {
      return {
        success: false,
        error: "Contact not found",
      };
    }

    // Verify the contact belongs to the user
    if (updatedContact.userId !== user.id) {
      return {
        success: false,
        error: "Not authorized to update this contact",
      };
    }

    return {
      success: true,
      contact: updatedContact,
    };
  } catch (error) {
    console.error("Error updating contact:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update contact",
    };
  }
}

export async function deleteContactAction(id: string) {
  try {
    const user = await stackServerApp.getUser({ or: "throw" });

    // First check if the contact exists and belongs to the user
    const [existingContact] = await db
      .select()
      .from(contactsTable)
      .where(and(eq(contactsTable.id, id), eq(contactsTable.userId, user.id)))
      .limit(1);

    if (!existingContact) {
      return {
        success: false,
        error: "Contact not found",
      };
    }

    if (existingContact.userId !== user.id) {
      return {
        success: false,
        error: "Not authorized to delete this contact",
      };
    }

    await db.delete(contactsTable).where(eq(contactsTable.id, id));

    return {
      success: true,
      contactId: id,
    };
  } catch (error) {
    console.error("Error deleting contact:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete contact",
    };
  }
}
