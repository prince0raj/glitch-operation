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
        `
        id,
        full_name,
        username,
        email,
        avatar_url,
        bio,
        tag_line,
        profile_metrics (
          score,
          rank
        )
      `
      )
      .eq("id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const rawMetricsArray = (data.profile_metrics ?? []) as
      | { score: number; rank: number }[]
      | [];
    const metricsRow = Array.isArray(rawMetricsArray)
      ? rawMetricsArray[0]
      : (rawMetricsArray as { score: number; rank: number });

    const score = Number(metricsRow?.score ?? 0);
    const rank = Number(metricsRow?.rank ?? 0);

    // ACTIVITY:

    const { data: activityData, error: errorActivity } = await supabase
      .from("submissions")
      .select(
        `
          submission_time:created_at,
          status,
          contest_id,
          contest_details:contests(
            title,
            reward
          )
      `
      )
      .eq("profile_id", userId);

    const rawContests = Array.isArray(activityData) ? activityData : [];

    let contestMetaMap: Record<
      string,
      { title: string | null; reward: number }
    > = {};
    const contests = rawContests.map((contest: any) => ({
      contest_id: String(contest?.contest_id ?? ""),
      status: String(contest?.status ?? ""),
      submission_time: contest?.submission_time
        ? String(contest.submission_time)
        : null,
    }));

    contestMetaMap = rawContests.reduce(
      (
        acc: Record<string, { title: string | null; reward: number }>,
        x: any
      ) => {
        if (x?.contest_id && x?.contest_details) {
          acc[String(x.contest_id)] = {
            title: x.contest_details.title ?? null,
            reward: x.contest_details.reward ?? 0,
          };
        }
        return acc;
      },
      {}
    );

    const contestsWithMeta = contests.map((contest) => {
      const meta = contestMetaMap[contest.contest_id];
      const rawReward = Number(meta?.reward ?? 0) || 0;
      const isPass = contest.status.toLowerCase() === "pass";

      return {
        ...contest,
        title: meta?.title ?? null,
        reward: isPass ? rawReward : 0,
      };
    });

    let xpTarget = 0;

    const { data: allContestRewards, error: rewardSumError } = await supabase
      .from("contests")
      .select("reward");

    if (!rewardSumError && Array.isArray(allContestRewards)) {
      xpTarget = allContestRewards.reduce((sum, current) => {
        const rewardValue = Number(current?.reward ?? 0);
        return sum + (Number.isFinite(rewardValue) ? rewardValue : 0);
      }, 0);
    }

    const challenges = contestsWithMeta.length;
    const bugsFound = contestsWithMeta.filter(
      (contest) => contest.status.toLowerCase() === "pass"
    ).length;
    const unsuccessfulAttempts = contestsWithMeta.filter(
      (contest) => contest.status.toLowerCase() === "fail"
    ).length;
    const level = Math.max(Math.floor(score / 1000), 1);

    const metrics = {
      Challenges: challenges,
      Bugs_found: bugsFound,
      Unsuccessful_attempts: unsuccessfulAttempts,
      Level: level,
      score: score,
      rank,
      xpTarget,
    };

    const activity = { contest: contestsWithMeta };

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
    const { bio, tag_line } = body ?? {};

    const updatePayload: Record<string, any> = {};
    if (typeof bio === "string") updatePayload.bio = bio;
    if (typeof tag_line === "string") updatePayload.tag_line = tag_line;

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
