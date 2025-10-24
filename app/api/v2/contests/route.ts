import { NextResponse } from "next/server";
import { requireAdminTokenFromRequest } from "@/lib/admin-jwt";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    requireAdminTokenFromRequest(request);

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contests")
      .select(
        `id, slug, title, difficulty, reward, participants, deadline, status, short_desc, created_at, updated_at`
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch contests", error);
      return NextResponse.json(
        { error: "Failed to fetch contests" },
        { status: 500 }
      );
    }

    return NextResponse.json({ contests: data ?? [] });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch contests";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
