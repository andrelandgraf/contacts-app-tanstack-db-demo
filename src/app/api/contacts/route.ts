import { stackServerApp } from "@/stack";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const user = await stackServerApp.getUser({ or: "redirect" });
  try {
    const requestUrl = new URL(request.url);
    const electricUrl = new URL("https://api.electric-sql.cloud/v1/shape");

    // Add Electric SQL credentials
    electricUrl.searchParams.set(
      "source_id",
      process.env.ELECTRIC_SQL_CLOUD_SOURCE_ID!,
    );
    electricUrl.searchParams.set(
      "source_secret",
      process.env.ELECTRIC_SQL_CLOUD_SOURCE_SECRET!,
    );

    requestUrl.searchParams.forEach((value, key) => {
      if (["live", "table", "handle", "offset", "cursor"].includes(key)) {
        electricUrl.searchParams.set(key, value);
      }
    });

    electricUrl.searchParams.set("table", "contacts");
    const filter = `user_id='${user.id}'`;
    electricUrl.searchParams.set("where", filter);

    // Proxy the request to Electric SQL
    const response = await fetch(electricUrl);

    // Remove problematic headers that could break decoding
    const headers = new Headers(response.headers);
    headers.delete("content-encoding");
    headers.delete("content-length");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    console.error("Electric SQL proxy error:", error);
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
