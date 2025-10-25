import { NextResponse } from "next/server";
import { requireAdminTokenFromRequest } from "@/lib/admin-jwt";
import { createAdminClient } from "@/utils/supabase/admin";

const TESTIMONIAL_COLUMNS =
  "id, name, role, level, avatar, text, rating, created_at";

const coerceOptionalField = (value: unknown) => {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const coerceRating = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    throw new Error("Rating must be an integer between 1 and 5");
  }

  if (parsed < 1 || parsed > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  return parsed;
};

export async function GET(request: Request) {
  try {
    requireAdminTokenFromRequest(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const supabase = createAdminClient();

    if (id) {
      const { data, error } = await supabase
        .from("testimonials")
        .select(TESTIMONIAL_COLUMNS)
        .eq("id", id)
        .single();

      if (error) {
        console.error(`Failed to fetch testimonial ${id}`, error);
        return NextResponse.json(
          { error: "Failed to fetch testimonial" },
          { status: 500 }
        );
      }

      if (!data) {
        return NextResponse.json(
          { error: "Testimonial not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ testimonial: data });
    }

    const { data, error } = await supabase
      .from("testimonials")
      .select(TESTIMONIAL_COLUMNS)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch testimonials", error);
      return NextResponse.json(
        { error: "Failed to fetch testimonials" },
        { status: 500 }
      );
    }

    return NextResponse.json({ testimonials: data ?? [] });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch testimonials";
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

    const { name, text, role, level, avatar, rating } = body as {
      name?: unknown;
      text?: unknown;
      role?: unknown;
      level?: unknown;
      avatar?: unknown;
      rating?: unknown;
    };

    const missingFields: string[] = [];

    if (typeof name !== "string" || !name.trim()) missingFields.push("name");
    if (typeof text !== "string" || !text.trim()) missingFields.push("text");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing or invalid fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    let ratingValue: number | null = null;
    try {
      ratingValue = coerceRating(rating);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Invalid rating" },
        { status: 400 }
      );
    }

    const nameValue = (name as string).trim();
    const textValue = (text as string).trim();

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        name: nameValue,
        text: textValue,
        role: coerceOptionalField(role),
        level: coerceOptionalField(level),
        avatar: coerceOptionalField(avatar),
        rating: ratingValue,
      })
      .select(TESTIMONIAL_COLUMNS)
      .single();

    if (error) {
      console.error("Failed to create testimonial", error);
      return NextResponse.json(
        { error: "Failed to create testimonial" },
        { status: 500 }
      );
    }

    return NextResponse.json({ testimonial: data }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create testimonial";
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
      name,
      text,
      role,
      level,
      avatar,
      rating,
    } = body as {
      id?: unknown;
      name?: unknown;
      text?: unknown;
      role?: unknown;
      level?: unknown;
      avatar?: unknown;
      rating?: unknown;
    };

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Testimonial id is required" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (typeof name === "string") {
      const trimmed = name.trim();
      if (!trimmed) {
        return NextResponse.json(
          { error: "Name cannot be empty" },
          { status: 400 }
        );
      }
      updateData.name = trimmed;
    }

    if (typeof text === "string") {
      const trimmed = text.trim();
      if (!trimmed) {
        return NextResponse.json(
          { error: "Text cannot be empty" },
          { status: 400 }
        );
      }
      updateData.text = trimmed;
    }

    if (role !== undefined) {
      updateData.role = coerceOptionalField(role);
    }

    if (level !== undefined) {
      updateData.level = coerceOptionalField(level);
    }

    if (avatar !== undefined) {
      updateData.avatar = coerceOptionalField(avatar);
    }

    if (rating !== undefined) {
      try {
        updateData.rating = coerceRating(rating);
      } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : "Invalid rating" },
          { status: 400 }
        );
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields provided for update" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("testimonials")
      .update(updateData)
      .eq("id", id)
      .select(TESTIMONIAL_COLUMNS)
      .single();

    if (error) {
      console.error(`Failed to update testimonial ${id}`, error);
      return NextResponse.json(
        { error: "Failed to update testimonial" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ testimonial: data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update testimonial";
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
        { error: "Testimonial id is required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", id)
      .select("id")
      .single();

    if (error) {
      console.error(`Failed to delete testimonial ${id}`, error);
      return NextResponse.json(
        { error: "Failed to delete testimonial" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete testimonial";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
