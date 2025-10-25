"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Orbitron } from "next/font/google";
import {
  ArrowLeft,
  Loader2,
  Save,
  Sparkle,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFetch } from "@/app/hook/useFetch";
import { Constants } from "@/app/utils/Constants";
import {
  AdminContentDescription,
  AdminContentHeader,
  AdminContentTitle,
} from "../../style";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

type TestimonialResponse = {
  testimonial: {
    id: string;
    name: string;
    role: string | null;
    level: string | null;
    avatar: string | null;
    text: string;
    rating: number | null;
  };
};

type FormState = {
  name: string;
  role: string;
  level: string;
  avatar: string;
  text: string;
  rating: string;
};

const initialState: FormState = {
  name: "",
  role: "",
  level: "",
  avatar: "",
  text: "",
  rating: "",
};

const ManageTestimonialPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testimonialId = searchParams.get("id");
  const isEditing = Boolean(testimonialId);

  const [token, setToken] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(Constants.OPS_GLITCH_TOKEN);
    setToken(storedToken);
  }, []);

  const testimonialUrl =
    testimonialId && token
      ? `/api/v2/testimonials?id=${encodeURIComponent(testimonialId)}`
      : null;

  const fetchOptions = useMemo(
    () =>
      token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : { manual: true },
    [token]
  );

  const {
    data: testimonialResponse,
    error: testimonialError,
    loading: testimonialLoading,
  } = useFetch<TestimonialResponse>(testimonialUrl, fetchOptions);

  useEffect(() => {
    if (!testimonialResponse?.testimonial) {
      return;
    }

    const { name, role, level, avatar, text, rating } = testimonialResponse.testimonial;

    setFormState({
      name: name ?? "",
      role: role ?? "",
      level: level ?? "",
      avatar: avatar ?? "",
      text: text ?? "",
      rating: rating !== null && rating !== undefined ? String(rating) : "",
    });
  }, [testimonialResponse?.testimonial]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const isValid = useMemo(() => {
    if (!formState.name.trim()) return false;
    if (!formState.text.trim()) return false;
    if (formState.rating.trim()) {
      const ratingValue = Number(formState.rating);
      if (!Number.isInteger(ratingValue)) return false;
      if (ratingValue < 1 || ratingValue > 5) return false;
    }
    return true;
  }, [formState]);

  const buildPayload = () => {
    const coerceOptional = (value: string) => {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    };

    const ratingValue = formState.rating.trim();
    const parsedRating = ratingValue.length > 0 ? Number(ratingValue) : null;

    return {
      name: formState.name.trim(),
      role: coerceOptional(formState.role),
      level: coerceOptional(formState.level),
      avatar: coerceOptional(formState.avatar),
      text: formState.text.trim(),
      rating: parsedRating,
    };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || isSubmitting) {
      return;
    }

    if (!token) {
      setSubmitError("Missing admin token. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = buildPayload();

    try {
      const response = await fetch("/api/v2/testimonials", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          isEditing
            ? {
                id: testimonialId,
                ...payload,
              }
            : payload
        ),
      });

      if (!response.ok) {
        let message = isEditing
          ? "Failed to update testimonial"
          : "Failed to create testimonial";
        try {
          const body = await response.json();
          if (body && typeof body.error === "string") {
            message = body.error;
          }
        } catch {
          // ignore JSON parse error
        }
        throw new Error(message);
      }

      router.push("/ui/controller/protected/admin-pannel/testimonials");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : isEditing
          ? "Testimonial update failed"
          : "Testimonial creation failed";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled =
    !isValid || isSubmitting || (isEditing && testimonialLoading);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            {isEditing ? "// Update testimony" : "// Craft new testimony"}
          </p>
          <h1
            className={`${orbitron.className} text-3xl sm:text-4xl font-semibold tracking-[0.25em] uppercase text-emerald-100`}
          >
            {isEditing ? "Edit Testimonial" : "Create Testimonial"}
          </h1>
          <p className="max-w-2xl text-sm text-slate-400">
            {isEditing
              ? "Tune the voice of your advocates. Refresh their words, role, or rating to keep social proof aligned with the current mission."
              : "Capture the words of trusted hunters and allies. A strong testimonial amplifies OPS GLITCH credibility across the network."}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-2 cursor-pointer text-emerald-200 hover:text-emerald-100"
          onClick={() => router.push("/ui/controller/protected/admin-pannel/testimonials")}
        >
          <ArrowLeft className="size-4" />
          Back to testimonials
        </Button>
      </div>

      {isEditing && testimonialError ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          {testimonialError}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="relative grid gap-6 rounded-2xl border border-emerald-500/20 bg-slate-950/70 p-6 sm:p-8 shadow-[0_25px_60px_rgba(2,6,23,0.6)] backdrop-blur-xl"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
            >
              Name
            </label>
            <Input
              id="name"
              value={formState.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Hunter Alias"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="role"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
            >
              Role / Title
            </label>
            <Input
              id="role"
              value={formState.role}
              onChange={(event) => updateField("role", event.target.value)}
              placeholder="Lead Researcher"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="level"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
            >
              Level / Affiliation
            </label>
            <Input
              id="level"
              value={formState.level}
              onChange={(event) => updateField("level", event.target.value)}
              placeholder="Elite Hunter"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="avatar"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
            >
              Avatar URL
            </label>
            <Input
              id="avatar"
              type="url"
              value={formState.avatar}
              onChange={(event) => updateField("avatar", event.target.value)}
              placeholder="https://ops-glitch.cdn/avatar.png"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="rating"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
            >
              Rating (1-5)
            </label>
            <Input
              id="rating"
              type="number"
              min={1}
              max={5}
              value={formState.rating}
              onChange={(event) => updateField("rating", event.target.value)}
              placeholder="5"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="text"
            className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
          >
            Testimonial Text
          </label>
          <Textarea
            id="text"
            rows={6}
            value={formState.text}
            onChange={(event) => updateField("text", event.target.value)}
            placeholder="Share how OPS GLITCH helped you neutralize a threat..."
            required
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            className="cursor-pointer text-emerald-200 hover:text-emerald-100"
            onClick={() => router.push("/ui/controller/protected/admin-pannel/testimonials")}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="gap-2 bg-emerald-500/25 text-emerald-100 hover:bg-emerald-400/35"
            disabled={isSubmitDisabled}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              isEditing ? <Save className="size-4" /> : <UserPlus className="size-4" />
            )}
            {isEditing ? "Update Testimonial" : "Create Testimonial"}
          </Button>
        </div>

        {submitError ? (
          <p className="text-sm text-red-400">{submitError}</p>
        ) : null}

        {isEditing && testimonialLoading ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-950/70 backdrop-blur">
            <Loader2 className="size-6 animate-spin text-emerald-200" />
          </div>
        ) : null}
      </form>
    </div>
  );
};

export default ManageTestimonialPage;
