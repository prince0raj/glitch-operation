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

    const { data: profileData, error } = await supabase
      .from("profiles")
      .select(
        `
            id,
            full_name,
            username,
            email,
            avatar_url,
            bio,
            tag_line,
            social_id,
            profile_metrics (
              rank
            ),
            contest_status (
              status,
              created_at,
              contest_id,
              contests (
                id,
                title,
                reward
              )
            ),
            profile_activities (
              status,
              created_at,
              contest_id,
              unique_code,
              contests (
                id,
                title,
                reward
              )
            )
          `
      )
      .eq("id", userId)
      .order("created_at", {
        foreignTable: "profile_activities",
        ascending: false,
      })
      .limit(5, { foreignTable: "profile_activities" })
      .single();

    if (error) throw error;

    // Compute stats
    const totalAttempts = profileData.contest_status?.length || 0;
    const successfulAttempts =
      profileData.contest_status?.filter((c) => c.status === "ACCEPTED")
        .length || 0;
    const failedAttempts =
      profileData.contest_status?.filter((c) => c.status === "REJECTED")
        .length || 0;
    const totalXPAchieved =
      profileData.contest_status
        ?.filter((c) => c.status === "ACCEPTED")
        .reduce((sum, c) => sum + (c.contests?.reward || 0), 0) || 0;

    // Map and structure recent activities
    const recentActivities =
      profileData.profile_activities?.map((activity) => ({
        status: activity.status,
        unique_code: activity.unique_code,
        created_at: activity.created_at,
        contest: {
          id: activity.contests?.id,
          title: activity.contests?.title,
          reward: activity.contests?.reward,
        },
      })) || [];

    const currentLevel = Math.floor(totalXPAchieved / 1000);
    const maxLevelXP = currentLevel * 1000 + 1000;

    const result = {
      profile: {
        id: profileData.id,
        social_id: profileData.social_id,
        full_name: profileData.full_name,
        username: profileData.username,
        email: profileData.email,
        avatar_url: profileData.avatar_url,
        bio: profileData.bio,
        tag_line: profileData.tag_line,
        totalXPAchieved: totalXPAchieved,
        currentLevel,
        maxLevelXP,
        rank: profileData.profile_metrics?.rank,
      },
      stats: {
        totalAttempts,
        successfulAttempts,
        failedAttempts,
      },
      recentActivities,
    };

    return NextResponse.json(result);
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
    const { bio, tag_line, social_id } = body ?? {};

    const updatePayload: Record<string, any> = {};
    if (typeof bio === "string") updatePayload.bio = bio;
    if (typeof tag_line === "string") updatePayload.tag_line = tag_line;
    if (typeof social_id === "string") updatePayload.social_id = social_id;

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
        `id,
        full_name,
        username,
        email,
        avatar_url,
        bio,
        tag_line,
        social_id,
        profile_metrics (
          score,
          rank
        )`
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
