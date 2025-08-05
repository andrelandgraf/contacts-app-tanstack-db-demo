import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";
import { contactsTable } from "@/schema";

// Zod schema for validating incoming JSON data (name only)
const createContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
});

export async function POST(request: NextRequest) {
  try {
    // Check for API secret in headers
    const apiSecret = request.headers.get("x-api-secret");

    if (!apiSecret || apiSecret !== process.env.API_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid API secret" },
        { status: 401 },
      );
    }

    // Parse and validate the request body
    const body = await request.json();
    const validationResult = createContactSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const { name } = validationResult.data;

    // Create the contact in the database
    const now = new Date();
    const newContact = {
      id: uuidv4(),
      userId: "api-user", // Use a placeholder for API-created contacts
      name,
      email: null,
      tel: null,
      title: null,
      company: null,
      createdAt: now,
      updatedAt: now,
    };

    const [createdContact] = await db
      .insert(contactsTable)
      .values(newContact)
      .returning();

    return NextResponse.json(
      {
        success: true,
        contact: createdContact,
        message: "Contact created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating contact via API:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to create contact",
      },
      { status: 500 },
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
