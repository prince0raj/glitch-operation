import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    let { data: testimonials, error } = await supabase.from("testimonals")
      .select(`
        id,
        text,
        rating,
        profile:profiles (
          id,
          full_name,
          social_id,
          username,
          avatar_url,
          role,
          profile_metrics: profile_metrics (
            id,
            rank
          )
        )
      `);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { testimonials: testimonials ?? [] },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
