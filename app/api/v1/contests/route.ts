import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Constants } from "@/app/utils/Constants";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("contests")
      .select(
        "id, slug, title, difficulty, deadline, short_desc, description, requirements, target_url, reward, submissions, status"
      )
      .order("deadline", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: contest_status_data, error: contest_status_error } =
      await supabase
        .from("contest_status")
        .select("contest_id, profile_id, status")
        .eq("profile_id", user.id);

    let finalData = data?.map((contest) => {
      const statusEntry = contest_status_data?.find(
        (cs) => cs.contest_id === contest.id
      );
      return {
        ...contest,
        user_submission_status: statusEntry ? statusEntry.status : null,
      };
    });

    return NextResponse.json({ contests: finalData ?? [] }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
