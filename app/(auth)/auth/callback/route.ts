import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createLogger } from "@/utils/logger";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const reqId = request.headers.get("x-request-id") ?? (globalThis as any).crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  const logger = createLogger({ reqId, route: "/auth/callback" });
  logger.info("AUTH_CALLBACK_START", { url: request.url, origin });
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";
  logger.info("AUTH_CALLBACK_QUERY", { hasCode: Boolean(code), next });

  if (!next.startsWith("/")) {
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      logger.error("AUTH_EXCHANGE_SESSION_ERROR", { message: error.message, name: error.name, status: (error as any)?.status });
    } else {
      logger.info("AUTH_EXCHANGE_SESSION_SUCCESS", { hasSession: Boolean(data?.session) });
    }

    if (!error && data?.session) {
      const user = data.session.user;
      logger.info("AUTH_SESSION_USER", { id: user?.id, email: user?.email });
      if (user?.email) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", user.email)
          .single();
        if (!profile) {
          const email = user.email;
          const username = email.split("@")[0];
          const full_name = user.user_metadata.full_name;
          const avatar_url = user.user_metadata.avatar_url;
          const role = "Student";

          logger.info("AUTH_PROFILE_UPSERT_START", { id: user.id, email, username });
          const { error: upsertError } = await supabase.from("profiles").upsert(
            {
              id: user.id,
              email,
              username,
              full_name,
              avatar_url,
              role,
            },
            { onConflict: "id" }
          );
          if (upsertError) {
            logger.error("AUTH_PROFILE_UPSERT_ERROR", { message: upsertError.message, code: (upsertError as any)?.code, details: (upsertError as any)?.details });
          } else {
            logger.info("AUTH_PROFILE_UPSERT_SUCCESS", { id: user.id });
          }
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      const target = isLocalEnv
        ? `${origin}/auth/success`
        : forwardedHost
        ? `https://${forwardedHost}/auth/success`
        : `${origin}/auth/success`;
      logger.info("AUTH_REDIRECT_DECISION", { isLocalEnv, forwardedHost, origin, target });
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}/auth/success`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}/auth/success`);
      } else {
        return NextResponse.redirect(`${origin}/auth/success`);
      }
    }
  }

  logger.error("AUTH_CALLBACK_FALLBACK_ERROR", { reason: "missing or invalid code or session exchange failed" });
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

