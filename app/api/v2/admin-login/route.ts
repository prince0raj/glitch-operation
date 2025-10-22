import { NextResponse } from "next/server";
import { signAdminJwt } from "@/lib/admin-jwt";

const ADMIN_ID = "admin";
const ADMIN_SECRET = "admin";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { adminId, secretKey } = body as {
      adminId?: string;
      secretKey?: string;
    };

    if (!adminId || !secretKey) {
      return NextResponse.json(
        { error: "`adminId` and `secretKey` are required" },
        { status: 400 }
      );
    }
    if (adminId !== ADMIN_ID || secretKey !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + 60 * 60; // 1 hour expiry

    const token = signAdminJwt({
      sub: adminId,
      role: "admin",
      iat: issuedAt,
      exp: expiresAt,
    });
    return NextResponse.json(
      {
        token,
        expiresIn: expiresAt - issuedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin login error", error);
    return NextResponse.json(
      { error: "Unable to process request" },
      { status: 500 }
    );
  }
}
