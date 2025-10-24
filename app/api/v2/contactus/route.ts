import { NextResponse } from "next/server";
import { requireAdminTokenFromRequest } from "@/lib/admin-jwt";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(request: Request) {
  try {
    requireAdminTokenFromRequest(request);

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("contactus")
      .select(
        "id, created_at, sender_name, sender_email, sender_subject, sender_message"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch contact submissions", error);
      return NextResponse.json(
        { error: "Failed to fetch contact submissions" },
        { status: 500 }
      );
    }

    return NextResponse.json({ messages: data ?? [] });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch contact submissions";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    requireAdminTokenFromRequest(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Message id is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("contactus")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Failed to delete contact message ${id}`, error);
      return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete contact submission";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
