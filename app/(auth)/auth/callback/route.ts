import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";

  if (!next.startsWith("/")) {
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.session) {
      const user = data.session.user;
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

          await supabase.from("profiles").upsert(
            {
              id: user.id,
              email,
              username,
              full_name,
              avatar_url,
            },
            { onConflict: "id" }
          );
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}/auth/success`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}/auth/success`);
      } else {
        return NextResponse.redirect(`${origin}/auth/success`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
