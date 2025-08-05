import { stackServerApp } from "@/stack";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TABLES = ["contacts"] as const;

function isAllowedTable(
  table: string | null,
): table is (typeof ALLOWED_TABLES)[number] {
  return (
    table !== null &&
    ALLOWED_TABLES.includes(table as (typeof ALLOWED_TABLES)[number])
  );
}

export async function GET(request: NextRequest) {
  const user = await stackServerApp.getUser({ or: "redirect" });
  try {
    const requestUrl = new URL(request.url);
    const electricUrl = new URL("https://api.electric-sql.cloud/v1/shape");

    // Copy all search params from the request
    requestUrl.searchParams.forEach((value, key) => {
      electricUrl.searchParams.set(key, value);
    });

    // Add Electric SQL credentials
    electricUrl.searchParams.set(
      "source_id",
      process.env.ELECTRIC_SQL_CLOUD_SOURCE_ID!,
    );
    electricUrl.searchParams.set(
      "source_secret",
      process.env.ELECTRIC_SQL_CLOUD_SOURCE_SECRET!,
    );

    // Validate table parameter
    const table = electricUrl.searchParams.get("table");
    if (!isAllowedTable(table)) {
      return NextResponse.json({ error: "Invalid table" }, { status: 400 });
    }

    // Combine client-side where clause with user_id filter
    const existingWhere = electricUrl.searchParams.get("where");
    const userIdFilter = `user_id='${user.id}'`;
    const combinedWhere = existingWhere
      ? `(${existingWhere}) AND ${userIdFilter}`
      : userIdFilter;

    electricUrl.searchParams.set("where", combinedWhere);

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
