import { NextResponse } from "next/server";
import { requireAdminTokenFromRequest } from "@/lib/admin-jwt";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(request: Request) {
  try {
    requireAdminTokenFromRequest(request);

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const contestId = searchParams.get("id");

    if (contestId) {
      const { data, error } = await supabase
        .from("contests")
        .select(
          `id, slug, title, difficulty, reward, participants, deadline, status, short_desc, description, requirements, target_url, created_at, updated_at`
        )
        .eq("id", contestId)
        .single();

      if (error) {
        console.error(`Failed to fetch contest ${contestId}`, error);
        return NextResponse.json(
          { error: "Failed to fetch contest" },
          { status: 500 }
        );
      }

      if (!data) {
        return NextResponse.json(
          { error: "Contest not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ contest: data });
    }

    const { data, error } = await supabase
      .from("contests")
      .select(
        `id, slug, title, difficulty, reward, participants, deadline, status, short_desc, description, requirements, target_url, created_at, updated_at`
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

export async function POST(request: Request) {
  try {
    requireAdminTokenFromRequest(request);

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const {
      slug,
      title,
      difficulty,
      participants,
      deadline,
      reward,
      status,
      short_desc,
      description,
      requirements,
      target_url,
    } = body as Record<string, unknown>;

    const missingFields: string[] = [];

    if (typeof slug !== "string" || !slug.trim()) missingFields.push("slug");
    if (typeof title !== "string" || !title.trim()) missingFields.push("title");
    if (typeof difficulty !== "string" || !difficulty.trim())
      missingFields.push("difficulty");
    if (typeof status !== "string" || !status.trim()) missingFields.push("status");
    if (typeof short_desc !== "string" || !short_desc.trim())
      missingFields.push("short_desc");
    if (typeof description !== "string" || !description.trim())
      missingFields.push("description");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing or invalid fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const slugValue = (slug as string).trim();
    const titleValue = (title as string).trim();
    const difficultyValue = (difficulty as string).trim();
    const statusValue = (status as string).trim();
    const shortDescValue = (short_desc as string).trim();
    const descriptionValue = (description as string).trim();

    const participantsNumber = (() => {
      if (typeof participants === "number" && Number.isFinite(participants)) {
        return participants;
      }
      const parsed = Number(participants);
      return Number.isFinite(parsed) ? parsed : 0;
    })();

    const rewardNumber = (() => {
      if (typeof reward === "number" && Number.isFinite(reward)) {
        return reward;
      }
      const parsed = Number(reward);
      return Number.isFinite(parsed) ? parsed : 0;
    })();

    const deadlineValue =
      typeof deadline === "string" && deadline.trim().length > 0
        ? deadline
        : null;

    const requirementList = Array.isArray(requirements)
      ? requirements
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter((item) => item.length > 0)
      : [];

    const targetUrlValue =
      typeof target_url === "string" && target_url.trim().length > 0
        ? target_url.trim()
        : null;

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("contests")
      .insert({
        slug: slugValue,
        title: titleValue,
        difficulty: difficultyValue,
        participants: participantsNumber,
        deadline: deadlineValue,
        reward: rewardNumber,
        status: statusValue,
        short_desc: shortDescValue,
        description: descriptionValue,
        requirements: requirementList,
        target_url: targetUrlValue,
      })
      .select(
        `id, slug, title, difficulty, reward, participants, deadline, status, short_desc, description, requirements, target_url, created_at, updated_at`
      )
      .single();

    if (error) {
      console.error("Failed to create contest", error);
      return NextResponse.json(
        { error: "Failed to create contest" },
        { status: 500 }
      );
    }

    return NextResponse.json({ contest: data }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create contest";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    requireAdminTokenFromRequest(request);

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const {
      id,
      slug,
      title,
      difficulty,
      participants,
      deadline,
      reward,
      status,
      short_desc,
      description,
      requirements,
      target_url,
    } = body as Record<string, unknown>;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Contest id is required" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof slug === "string") updateData.slug = slug;
    if (typeof title === "string") updateData.title = title;
    if (typeof difficulty === "string") updateData.difficulty = difficulty;
    if (typeof status === "string") updateData.status = status;
    if (typeof short_desc === "string") updateData.short_desc = short_desc;
    if (typeof description === "string") updateData.description = description;
    if (target_url === null || typeof target_url === "string") {
      updateData.target_url = target_url;
    }

    if (typeof participants === "number" && Number.isFinite(participants)) {
      updateData.participants = participants;
    }

    if (typeof reward === "number" && Number.isFinite(reward)) {
      updateData.reward = reward;
    }

    if (deadline === null || typeof deadline === "string") {
      updateData.deadline = deadline;
    }

    if (Array.isArray(requirements)) {
      updateData.requirements = requirements.filter(
        (item): item is string => typeof item === "string"
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("contests")
      .update(updateData)
      .eq("id", id)
      .select(
        `id, slug, title, difficulty, reward, participants, deadline, status, short_desc, description, requirements, target_url, created_at, updated_at`
      )
      .single();

    if (error) {
      console.error(`Failed to update contest ${id}`, error);
      return NextResponse.json(
        { error: "Failed to update contest" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Contest not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ contest: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update contest";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
