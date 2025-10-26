import { requireAdminTokenFromRequest } from "@/lib/admin-jwt";
import { createAdminClient } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const prefixUsername = searchParams.get('username') || "";

    requireAdminTokenFromRequest(request);
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, username"
      )
      .like("username", `%${prefixUsername}%`);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch usernames and ids" },
        { status: 500 }
      );
    }

    return NextResponse.json({ usernames: data }, { status: 200 });

}
