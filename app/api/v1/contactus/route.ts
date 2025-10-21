import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const {
      sender_name,
      sender_email,
      sender_subject,
      sender_message,
    } = await request.json();

    if (
      !sender_name ||
      !sender_email ||
      !sender_subject ||
      !sender_message
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from("contactus").insert({
      sender_name,
      sender_email,
      sender_subject,
      sender_message,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Message received" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
