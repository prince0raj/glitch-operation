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
        "id, title, status, created_at, document_link, reference_url, proposal_link, full_name, email"
      )
      .eq("email", email)
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
  let body: Record<string, unknown> | null = null;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const title = body?.title;
  const documentLink = body?.document_link ?? body?.documentLink;
  const fullName = body?.full_name ?? body?.fullName;
  const email = body?.email;
  const referenceUrl = sanitizeOptionalString(
    body?.reference_url ?? body?.referenceUrl
  );
  const proposalLink = sanitizeOptionalString(
    body?.proposal_link ?? body?.proposalLink
  );
  const statusRaw = body?.status;

  if (!isNonEmptyString(title)) {
    return NextResponse.json(
      { error: "Field 'title' is required" },
      { status: 400 }
    );
  }

  if (!isNonEmptyString(documentLink)) {
    return NextResponse.json(
      { error: "Field 'document_link' is required" },
      { status: 400 }
    );
  }

  if (!isNonEmptyString(fullName)) {
    return NextResponse.json(
      { error: "Field 'full_name' is required" },
      { status: 400 }
    );
  }

  let status: ProposalStatus = "In Review";
  if (typeof statusRaw === "string") {
    const trimmedStatus = statusRaw.trim();
    if (!ALLOWED_STATUSES.has(trimmedStatus as ProposalStatus)) {
      return NextResponse.json(
        {
          error:
            "Field 'status' must be one of In Review, Needs Info, Approved, Rejected",
        },
        { status: 400 }
      );
    }
    status = trimmedStatus as ProposalStatus;
  }

  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error(
        "Failed to resolve authenticated user for breach proposal",
        authError
      );
      return NextResponse.json(
        { error: "Unable to verify current user" },
        { status: 401 }
      );
    }

    if (!user) {
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

    if (
      isNonEmptyString(email) &&
      email.trim().toLowerCase() !== sessionEmail.toLowerCase()
    ) {
      return NextResponse.json(
        { error: "Email does not match authenticated user" },
        { status: 403 }
      );
    }

    const insertPayload = {
      title: title.trim(),
      document_link: String(documentLink).trim(),
      full_name: String(fullName).trim(),
      email: sessionEmail,
      status,
      reference_url: referenceUrl,
      proposal_link: proposalLink,
    };

    const { data, error } = await supabase
      .from("breach_proposal")
      .insert(insertPayload)
      .select(
        "id, title, status, created_at, document_link, reference_url, proposal_link, full_name, email"
      )
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ proposal: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
