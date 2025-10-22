import { NextResponse } from "next/server";
import { requireAdminTokenFromRequest } from "@/lib/admin-jwt";

export async function GET(request: Request) {
  try {
    const payload = requireAdminTokenFromRequest(request);
    return NextResponse.json({ status: "ok", payload });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unauthorized admin access";
    return NextResponse.json(
      { error: message },
      { status: 401 }
    );
  }
}
