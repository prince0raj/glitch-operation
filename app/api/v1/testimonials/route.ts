import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();

        let { data: testimonials, error } = await supabase.from("testimonals")
            .select(`
        id,
        text,
        social_id,
        profile:profiles (
          id,
          full_name,
          email,
          username,
          avatar_url,
          role,
          profile_metrics: profile_metrics (
            id,
            score,
            rank
          )
        )
      `);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(
            { testimonials: testimonials ?? [] },
            { status: 200 },
        );
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message ?? "Unknown error" },
            { status: 500 },
        );
    }
}
