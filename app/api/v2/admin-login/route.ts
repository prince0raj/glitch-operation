import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";

const ADMIN_ID = "admin";
const ADMIN_SECRET = "admin";

const base64UrlEncode = (input: string | Buffer) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const signJwt = (payload: Record<string, unknown>, secret: string) => {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const headerPart = base64UrlEncode(JSON.stringify(header));
  const payloadPart = base64UrlEncode(JSON.stringify(payload));
  const signature = createHmac("sha256", secret)
    .update(`${headerPart}.${payloadPart}`)
    .digest("base64");
  const signaturePart = signature
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${headerPart}.${payloadPart}.${signaturePart}`;
};

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

    const secret = process.env.ADMIN_JWT_SECRET;

    if (!secret) {
      console.error("ADMIN_JWT_SECRET is not configured.");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + 60 * 60; // 1 hour expiry

    const token = signJwt(
      {
        sub: adminId,
        role: "admin",
        iat: issuedAt,
        exp: expiresAt,
      },
      secret
    );
    console.log("token is valid");
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
