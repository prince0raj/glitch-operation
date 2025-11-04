import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

const STATUS_VALUES = [
  "In Review",
  "Needs Info",
  "Approved",
  "Rejected",
] as const;

type ProposalStatus = (typeof STATUS_VALUES)[number];

const ALLOWED_STATUSES = new Set<ProposalStatus>(STATUS_VALUES);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function sanitizeOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email")?.trim();

  if (!email) {
    return NextResponse.json(
      { error: "Query parameter 'email' is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("breach_proposal")
      .select(
        `
          id,
          title,
          status,
          created_at,
          document_link,
          reference_url,
          proposal_link,
          profile_id,
          profiles (
            full_name,
            social_id,
            email
          )
        `
      )
      .eq("profiles.email", email) // ✅ correct filter path
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ proposals: data ?? [] }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const title = body?.title?.trim();
  const documentLink = body?.document_link ?? body?.documentLink;
  const referenceUrl = body?.reference_url ?? body?.referenceUrl;
  const proposalLink = body?.proposal_link ?? body?.proposalLink;
  const statusRaw = body?.status;

  if (!title) {
    return NextResponse.json(
      { error: "Field 'title' is required" },
      { status: 400 }
    );
  }
  if (!documentLink) {
    return NextResponse.json(
      { error: "Field 'document_link' is required" },
      { status: 400 }
    );
  }

  let status = "In Review";
  if (typeof statusRaw === "string") {
    const trimmed = statusRaw.trim();
    const allowed = ["In Review", "Needs Info", "Approved", "Rejected"];
    if (!allowed.includes(trimmed)) {
      return NextResponse.json(
        {
          error:
            "Invalid status. Must be one of In Review, Needs Info, Approved, Rejected",
        },
        { status: 400 }
      );
    }
    status = trimmed;
  }

  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const sessionEmail = user.email?.trim();
    if (!sessionEmail) {
      return NextResponse.json(
        { error: "Your account is missing a verified email address" },
        { status: 400 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", sessionEmail)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found for the authenticated user" },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("breach_proposal")
      .insert({
        title,
        document_link: String(documentLink).trim(),
        reference_url: referenceUrl ? String(referenceUrl).trim() : null,
        proposal_link: proposalLink ? String(proposalLink).trim() : null,
        status,
        profile_id: profile.id,
      })
      .select(
        `
        id,
        title,
        status,
        created_at,
        document_link,
        reference_url,
        proposal_link,
        profiles (
          full_name,
          email,
          social_id
        )
      `
      )
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ proposal: data }, { status: 201 });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
