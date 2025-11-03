import { createHmac, timingSafeEqual } from "node:crypto";

const header = {
  alg: "HS256",
  typ: "JWT",
};

const base64UrlEncode = (input: string | Buffer) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const padBase64 = (value: string) => {
  const padding = (4 - (value.length % 4)) % 4;
  return value + "=".repeat(padding);
};

const base64UrlDecode = (input: string) =>
  Buffer.from(
    padBase64(input).replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  ).toString();

const base64UrlDecodeToBuffer = (input: string) =>
  Buffer.from(padBase64(input).replace(/-/g, "+").replace(/_/g, "/"), "base64");

const getSecret = () => {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET is not configured.");
  }
  return secret;
};

export type AdminJwtPayload = {
  sub: string;
  role: string;
  iat: number;
  exp: number;
  [key: string]: unknown;
};

export const signAdminJwt = (payload: AdminJwtPayload) => {
  const secret = getSecret();
  const headerPart = base64UrlEncode(JSON.stringify(header));
  const payloadPart = base64UrlEncode(JSON.stringify(payload));
  const signature = createHmac("sha256", secret)
    .update(`${headerPart}.${payloadPart}`)
    .digest();
  const signaturePart = base64UrlEncode(signature);

  return `${headerPart}.${payloadPart}.${signaturePart}`;
};

export const verifyAdminJwt = (token: string): AdminJwtPayload => {
  const secret = getSecret();
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid token structure");
  }

  const [headerPart, payloadPart, signaturePart] = parts;
  const expectedSignature = createHmac("sha256", secret)
    .update(`${headerPart}.${payloadPart}`)
    .digest();
  const providedSignature = base64UrlDecodeToBuffer(signaturePart);

  if (
    expectedSignature.length !== providedSignature.length ||
    !timingSafeEqual(expectedSignature, providedSignature)
  ) {
    throw new Error("Invalid token signature");
  }

  const decodedHeader = JSON.parse(base64UrlDecode(headerPart));
  if (decodedHeader.alg !== "HS256") {
    throw new Error("Unsupported token algorithm");
  }

  const payload = JSON.parse(base64UrlDecode(payloadPart)) as AdminJwtPayload;
  const currentTime = Math.floor(Date.now() / 1000);
  if (typeof payload.exp === "number" && payload.exp < currentTime) {
    throw new Error("Token expired");
  }

  return payload;
};

export const extractAdminToken = (authorizationHeader?: string | null) => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token.trim();
};

export const requireAdminTokenFromRequest = (request: Request) => {
  const token = extractAdminToken(request.headers.get("authorization"));
  if (!token) {
    throw new Error("Missing admin token");
  }

  return verifyAdminJwt(token);
};
