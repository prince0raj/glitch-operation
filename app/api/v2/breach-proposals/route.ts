import { NextResponse } from "next/server";

import { requireAdminTokenFromRequest } from "@/lib/admin-jwt";
import { createAdminClient } from "@/utils/supabase/admin";

const PROPOSAL_COLUMNS =
  "id, title, status, created_at, document_link, reference_url, proposal_link, full_name, email";

const STATUS_VALUES = ["In Review", "Needs Info", "Approved", "Rejected"] as const;

type ProposalStatus = (typeof STATUS_VALUES)[number];

const ALLOWED_STATUSES = new Set<ProposalStatus>(STATUS_VALUES);

const sanitizeOptionalString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const sanitizeRequiredString = (value: unknown, field: string): string => {
  if (typeof value !== "string") {
    throw new Error(`Field '${field}' must be a string`);
  }

  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error(`Field '${field}' cannot be empty`);
  }

  return trimmed;
};

const coerceStatus = (value: unknown): ProposalStatus | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  if (!ALLOWED_STATUSES.has(trimmed as ProposalStatus)) {
    throw new Error(
      "Field 'status' must be one of In Review, Needs Info, Approved, Rejected"
    );
  }

  return trimmed as ProposalStatus;
};

export async function GET(request: Request) {
  try {
    requireAdminTokenFromRequest(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const supabase = createAdminClient();

    if (id) {
      const { data, error } = await supabase
        .from("breach_proposal")
        .select(PROPOSAL_COLUMNS)
        .eq("id", id)
        .single();

      if (error) {
        console.error(`Failed to fetch breach proposal ${id}`, error);
        return NextResponse.json(
          { error: "Failed to fetch breach proposal" },
          { status: 500 }
        );
      }

      if (!data) {
        return NextResponse.json(
          { error: "Breach proposal not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ proposal: data }, { status: 200 });
    }

    const { data, error } = await supabase
      .from("breach_proposal")
      .select(PROPOSAL_COLUMNS)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch breach proposals", error);
      return NextResponse.json(
        { error: "Failed to fetch breach proposals" },
        { status: 500 }
      );
    }

    return NextResponse.json({ proposals: data ?? [] }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch breach proposals";
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
      title,
      status,
      document_link,
      reference_url,
      proposal_link,
      full_name,
      email,
    } = body as Record<string, unknown>;

    if (typeof id !== "string" || !id.trim()) {
      return NextResponse.json(
        { error: "Breach proposal id is required" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};

    try {
      if (title !== undefined) {
        updateData.title = sanitizeRequiredString(title, "title");
      }

      if (status !== undefined) {
        updateData.status = coerceStatus(status);
      }

      if (document_link !== undefined) {
        updateData.document_link = sanitizeOptionalString(document_link);
      }

      if (reference_url !== undefined) {
        updateData.reference_url = sanitizeOptionalString(reference_url);
      }

      if (proposal_link !== undefined) {
        updateData.proposal_link = sanitizeOptionalString(proposal_link);
      }

      if (full_name !== undefined) {
        updateData.full_name = sanitizeOptionalString(full_name);
      }

      if (email !== undefined) {
        updateData.email = sanitizeOptionalString(email);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid payload";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields provided for update" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("breach_proposal")
      .update(updateData)
      .eq("id", id)
      .select(PROPOSAL_COLUMNS)
      .single();

    if (error) {
      console.error(`Failed to update breach proposal ${id}`, error);
      return NextResponse.json(
        { error: "Failed to update breach proposal" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Breach proposal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ proposal: data }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update breach proposal";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    requireAdminTokenFromRequest(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Breach proposal id is required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("breach_proposal")
      .delete()
      .eq("id", id)
      .select("id")
      .single();

    if (error) {
      console.error(`Failed to delete breach proposal ${id}`, error);
      return NextResponse.json(
        { error: "Failed to delete breach proposal" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Breach proposal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete breach proposal";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
