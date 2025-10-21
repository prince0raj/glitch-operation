import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
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

    const url = new URL(request.url);
    const userId = url.searchParams.get("userId") || user.id;

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, full_name, username, email, avatar_url, bio, tag_line, metrics, activity"
      )
      .eq("id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const defaultMetrics = {
      Challenges: 0,
      Bugs_found: 0,
      Achievements: 0,
      Level: 1,
      score: 0,
    } as const;

    const defaultActivity = {
      content: [] as Array<{ text: string; xp?: number }>,
    };

    const rawMetrics = data.metrics ?? defaultMetrics;
    const metrics = {
      Challenges: Number.parseInt(String(rawMetrics?.Challenges ?? 0)) || 0,
      Bugs_found: Number.parseInt(String(rawMetrics?.Bugs_found ?? 0)) || 0,
      Achievements: Number.parseInt(String(rawMetrics?.Achievements ?? 0)) || 0,
      Level: Number.parseInt(String(rawMetrics?.Level ?? 1)) || 1,
      score: Number.parseInt(String(rawMetrics?.score ?? 0)) || 0,
    };
    const activity = data.activity ?? defaultActivity;

    return NextResponse.json(
      {
        profile: {
          id: data.id,
          full_name: data.full_name,
          username: data.username,
          email: data.email,
          avatar_url: data.avatar_url,
          bio: data.bio,
          tag_line: data.tag_line,
          metrics,
          activity,
        },
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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

    const body = await request.json().catch(() => ({}));
    const { bio, tag_line, metrics, activity } = body ?? {};

    const updatePayload: Record<string, any> = {};
    if (typeof bio === "string") updatePayload.bio = bio;
    if (typeof tag_line === "string") updatePayload.tag_line = tag_line;

    if (metrics && typeof metrics === "object") {
      const m = metrics as Record<string, any>;
      updatePayload.metrics = {
        Challenges: Number.parseInt(String(m?.Challenges ?? 0)) || 0,
        Bugs_found: Number.parseInt(String(m?.Bugs_found ?? 0)) || 0,
        Achievements: Number.parseInt(String(m?.Achievements ?? 0)) || 0,
        score: Number.parseInt(String(m?.score ?? 0)) || 0,
        Level: Math.max(
          Math.floor(Number.parseInt(String(m?.score ?? 0)) / 1000),
          1
        ),
      };
    }

    if (activity && typeof activity === "object") {
      const content = Array.isArray(activity.content) ? activity.content : [];
      updatePayload.activity = {
        content: content.map((a: any) => ({
          text: String(a?.text ?? ""),
          xp: Number(a?.xp) || undefined,
        })),
      };
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", user.id)
      .select(
        "id, full_name, username, email, avatar_url, bio, tag_line, metrics, activity"
      )
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
