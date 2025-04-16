import { NextResponse } from "next/server";

export async function GET() {
  // Get the current server time
  const now = new Date();

  return NextResponse.json({
    timestamp: now.getTime(),
    iso: now.toISOString(),
  });
}
