import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { ContestSubmissionSchema } from "@/app/utils/schema/contest_submission_schema";
import * as z from "zod";
import { getContestDetails, insertIntoContestStatus, insertIntoProfileActivities, updateCodeStatus, validateContestCode } from "@/app/utils/database_interactions";

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


export async function POST(request: Request, { params }: RouteParams) {
    try {

        const supabase = await createClient();

        const { data: { user }, error } = await supabase.auth.getUser();

        if(error || !user) {
            return NextResponse.json({ error: "User is not authenticated" });
        }

        // Getting the contest information
        const { id: contestId } = await params;
        await getContestDetails(supabase, contestId);

        // Validating the schema
        const res = await request.json();
        await ContestSubmissionSchema.parseAsync(res);

        // Check the validation of code
        const code = res['uniqueCode'];
        const codeStatus = await validateContestCode(supabase, contestId, code);

        // Push the data to profiles_activities
        insertIntoProfileActivities(supabase, res, codeStatus, contestId, user.id);

        // Push the data to contest_status
        insertIntoContestStatus(supabase, codeStatus, contestId, user.id);

        // Update the status in contest_codes
        if(codeStatus) {
            await updateCodeStatus(supabase, contestId);
        }

        return NextResponse.json({ message: "Registered the entry", status: codeStatus }, { status: 201 });

    } catch(e) {
        let errorMessage = "Unexpected Error Occur :(";
        if(e instanceof Error) {
            errorMessage = e.message;
        }
        if (e instanceof z.ZodError) {
            errorMessage = e.message;
        }
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}
