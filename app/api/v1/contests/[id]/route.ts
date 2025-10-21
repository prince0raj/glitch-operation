import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: RouteParams) {
  const idParam = params?.id;

  if (!idParam) {
    return NextResponse.json({ error: "Contest id is required" }, { status: 400 });
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("contests")
      .select(
        "id, title, difficulty, participants, deadline, reward, status, short_desc, description, requirements, target_url"
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
      ? data.requirements.filter((req): req is string => typeof req === "string" && req.trim().length > 0)
      : [];

    return NextResponse.json(
      {
        contest: {
          id: data.id,
          title: data.title,
          difficulty: data.difficulty,
          participants: Number(data.participants ?? 0),
          deadline: data.deadline,
          reward: Number(data.reward ?? 0),
          status: data.status,
          short_desc: data.short_desc,
          description: data.description,
          requirements,
          target_url: data.target_url,
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
