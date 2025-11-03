import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { id: idParam } = await params;

  if (!idParam) {
    return NextResponse.json(
      { error: "Contest id is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("contests")
      .select(
        `
            id,
            slug,
            title,
            difficulty,
            deadline,
            short_desc,
            description,
            requirements,
            target_url,
            reward,
            submissions,
            status,
            creators:profiles_to_contests (
              profiles (
                username,
                social_id
              )
            )
          `
      )
      .eq("id", idParam)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Contest not found" }, { status: 404 });
    }

    const requirements = Array.isArray(data.requirements)
      ? data.requirements.filter(
          (req): req is string =>
            typeof req === "string" && req.trim().length > 0
        )
      : [];

    return NextResponse.json(
      {
        contest: {
          id: data.id,
          title: data.title,
          difficulty: data.difficulty,
          deadline: data.deadline,
          reward: Number(data.reward ?? 0),
          submissions: data.submissions,
          short_desc: data.short_desc,
          description: data.description,
          requirements,
          target_url: data.target_url,
          creators: data.creators,
          status: data.status,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
