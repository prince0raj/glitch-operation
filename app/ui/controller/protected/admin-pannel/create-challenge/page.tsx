"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Orbitron } from "next/font/google";
import {
  BadgePlus,
  CalendarIcon,
  Loader2,
  PlusCircle,
  Sparkle,
  ArrowLeft,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFetch } from "@/app/hook/useFetch";
import { Constants } from "@/app/utils/Constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const difficulties = ["Easy", "Medium", "Hard"] as const;
const statuses = ["Active", "Closed", "Draft"] as const;

type Difficulty = (typeof difficulties)[number];
type Status = (typeof statuses)[number];

type CreatorInput = {
  creator_name: string;
  social_Id: string;
};

type CreatorResponseItem = {
  creator_name: string | null;
  social_Id: string | null;
};

const createEmptyCreator = (): CreatorInput => ({
  creator_name: "",
  social_Id: "",
});

interface ContestFormState {
  slug: string;
  title: string;
  difficulty: Difficulty;
  participants: string;
  deadline: Date | null;
  reward: string;
  status: Status;
  short_desc: string;
  description: string;
  target_url: string;
}

const initialState: ContestFormState = {
  slug: "",
  title: "",
  difficulty: "Medium",
  participants: "0",
  deadline: null,
  reward: "0",
  status: "Active",
  short_desc: "",
  description: "",
  target_url: "",
};

type ContestResponse = {
  contest: {
    id: string;
    slug: string;
    title: string;
    difficulty: string;
    reward: number;
    participants: number;
    deadline: string | null;
    status: string;
    short_desc: string | null;
    description: string | null;
    requirements: string[] | null;
    target_url: string | null;
    creator: CreatorResponseItem[] | CreatorResponseItem | null;
    created_at: string;
    updated_at: string;
  };
};

const CreateChallengePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contestId = searchParams.get("id");
  const isEditing = Boolean(contestId);
  const [formState, setFormState] = useState<ContestFormState>(initialState);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [requirementDraft, setRequirementDraft] = useState("");
  const [creators, setCreators] = useState<CreatorInput[]>([createEmptyCreator()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(Constants.OPS_GLITCH_TOKEN);
    setToken(storedToken);
  }, []);

  const contestUrl = contestId && token ? `/api/v2/contests?id=${encodeURIComponent(contestId)}` : null;

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
    data: contestResponse,
    error: contestError,
    loading: contestLoading,
  } = useFetch<ContestResponse>(contestUrl, fetchOptions);

  useEffect(() => {
    const contest = contestResponse?.contest;
    if (!contest) {
      return;
    }

    const parsedDeadline = contest.deadline ? new Date(contest.deadline) : null;
    const safeDeadline =
      parsedDeadline && !Number.isNaN(parsedDeadline.getTime())
        ? parsedDeadline
        : null;

    const difficulty = difficulties.includes(contest.difficulty as Difficulty)
      ? (contest.difficulty as Difficulty)
      : "Medium";

    const status = statuses.includes(contest.status as Status)
      ? (contest.status as Status)
      : "Active";

    setFormState({
      slug: contest.slug ?? "",
      title: contest.title ?? "",
      difficulty,
      participants:
        contest.participants !== null && contest.participants !== undefined
          ? String(contest.participants)
          : "0",
      deadline: safeDeadline,
      reward:
        contest.reward !== null && contest.reward !== undefined
          ? String(contest.reward)
          : "0",
      status,
      short_desc: contest.short_desc ?? "",
      description: contest.description ?? "",
      target_url: contest.target_url ?? "",
    });

    setRequirements(
      Array.isArray(contest.requirements)
        ? contest.requirements.filter((item): item is string => Boolean(item))
        : []
    );
    setRequirementDraft("");

    const rawCreators = Array.isArray(contest.creator)
      ? contest.creator
      : contest.creator
      ? [contest.creator]
      : [];

    const mappedCreators = rawCreators
      .map((entry) => ({
        creator_name:
          typeof entry?.creator_name === "string" ? entry.creator_name : "",
        social_Id:
          typeof entry?.social_Id === "string" ? entry.social_Id : "",
      }))
      .filter((item) => item.creator_name || item.social_Id);

    setCreators(
      mappedCreators.length > 0 ? mappedCreators : [createEmptyCreator()]
    );
  }, [contestResponse?.contest]);

  const handleSlugChange = (value: string) => {
    const sanitized = value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 4);
    setFormState((prev) => ({ ...prev, slug: sanitized }));
  };

  const updateField = <K extends keyof ContestFormState>(
    key: K,
    value: ContestFormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const addRequirement = () => {
    const trimmed = requirementDraft.trim();
    if (!trimmed || requirements.includes(trimmed)) {
      return;
    }
    setRequirements((prev) => [...prev, trimmed]);
    setRequirementDraft("");
  };

  const removeRequirement = (value: string) => {
    setRequirements((prev) => prev.filter((item) => item !== value));
  };

  const handleRequirementKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addRequirement();
    }
  };

  const handleCreatorChange = (
    index: number,
    key: keyof CreatorInput,
    value: string
  ) => {
    setCreators((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [key]: value,
            }
          : item
      )
    );
  };

  const addCreator = () => {
    setCreators((prev) => [...prev, createEmptyCreator()]);
  };

  const removeCreator = (index: number) => {
    setCreators((prev) => {
      const next = prev.filter((_, idx) => idx !== index);
      return next.length > 0 ? next : [createEmptyCreator()];
    });
  };

  const isValid = useMemo(() => {
    if (formState.slug.length !== 4) return false;
    if (!formState.title.trim()) return false;
    if (!formState.short_desc.trim()) return false;
    if (!formState.description.trim()) return false;
    if (!difficulties.includes(formState.difficulty)) return false;
    if (!statuses.includes(formState.status)) return false;
    return true;
  }, [formState]);

  const buildPayload = () => {
    return {
      slug: formState.slug,
      title: formState.title.trim(),
      difficulty: formState.difficulty,
      participants: Number(formState.participants) || 0,
      deadline: formState.deadline
        ? formState.deadline.toISOString().split("T")[0]
        : null,
      reward: Number(formState.reward) || 0,
      status: formState.status,
      short_desc: formState.short_desc.trim(),
      description: formState.description.trim(),
      requirements,
      target_url: formState.target_url.trim() || null,
      creator: creators
        .map((entry) => ({
          creator_name: entry.creator_name.trim(),
          social_Id: entry.social_Id.trim(),
        }))
        .filter((entry) => entry.creator_name || entry.social_Id),
    };
  };

  const submitContest = async (payload: ReturnType<typeof buildPayload>) => {
    if (!token) {
      throw new Error("Missing admin token. Please log in again.");
    }

    if (isEditing && contestId) {
      const response = await fetch("/api/v2/contests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: contestId,
          ...payload,
        }),
      });

      if (!response.ok) {
        let message = "Failed to update contest";
        try {
          const errorBody = await response.json();
          if (errorBody && typeof errorBody.error === "string") {
            message = errorBody.error;
          }
        } catch {
          // ignore json parse error
        }
        throw new Error(message);
      }

      await response.json();
    } else {
      const response = await fetch("/api/v2/contests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message = "Failed to create contest";
        try {
          const errorBody = await response.json();
          if (errorBody && typeof errorBody.error === "string") {
            message = errorBody.error;
          }
        } catch {
          // ignore json parse error
        }
        throw new Error(message);
      }

      await response.json();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || isSubmitting) {
      return;
    }

    if (isEditing && !contestId) {
      setSubmitError("Missing contest identifier");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = buildPayload();
      await submitContest(payload);
      router.push("/ui/controller/protected/admin-pannel");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Contest submission failed";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled =
    !isValid || isSubmitting || (isEditing && contestLoading);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            {isEditing ? "// Update existing operation" : "// Launch new operation"}
          </p>
          <h1
            className={`${orbitron.className} text-3xl sm:text-4xl font-semibold tracking-[0.25em] uppercase text-emerald-100`}
          >
            {isEditing ? "Update Contest" : "Create Contest"}
          </h1>
          <p className="max-w-2xl text-sm text-slate-400">
            {isEditing
              ? "Review and adjust this mission before redeploying it to the hunters. Ensure all parameters reflect the latest scope."
              : "Define a new bug bounty mission, outline the scope, and set expectations for the hunters. All parameters must reflect the security schema for accurate deployment."}
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="gap-2 cursor-pointer text-emerald-200 hover:text-emerald-100"
          onClick={() => router.push("/ui/controller/protected/admin-pannel")}
        >
          <ArrowLeft className="size-4" />
          Back to contests
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative grid gap-6 rounded-2xl border border-emerald-500/20 bg-slate-950/70 p-6 sm:p-8 shadow-[0_25px_60px_rgba(2,6,23,0.6)] backdrop-blur-xl"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="slug"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
            >
              Challenge code (4 chars)
            </label>
            <Input
              id="slug"
              value={formState.slug}
              onChange={(event) => handleSlugChange(event.target.value)}
              placeholder="AB12"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
            >
              Title
            </label>
            <Input
              id="title"
              value={formState.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Ghost Hydra Breach"
              required
            />
          </div>

          <div className="space-y-2  flex items-baseline gap-4">
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
              Difficulty
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-between border-emerald-500/30 bg-slate-950/60 text-slate-100 hover:bg-emerald-500/10"
                >
                  <span>{formState.difficulty}</span>
                  <Sparkle className="size-4 text-emerald-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="bg-slate-950/95 text-slate-100"
              >
                {difficulties.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onSelect={() => updateField("difficulty", option)}
                    className="cursor-pointer"
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2 flex items-baseline gap-4">
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
              Status
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-between border-emerald-500/30 bg-slate-950/60 text-slate-100 hover:bg-emerald-500/10"
                >
                  <span>{formState.status}</span>
                  <Sparkle className="size-4 text-emerald-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="bg-slate-950/95 text-slate-100"
              >
                {statuses.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onSelect={() => updateField("status", option)}
                    className="cursor-pointer"
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="participants"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
            >
              Participants
            </label>
            <Input
              id="participants"
              type="number"
              min={0}
              value={formState.participants}
              onChange={(event) =>
                updateField("participants", event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
              Deadline
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start gap-2 border-emerald-500/30 bg-slate-950/60 text-left font-normal hover:bg-emerald-500/10 ${
                    !formState.deadline ? "text-slate-500" : "text-slate-100"
                  }`}
                >
                  <CalendarIcon className="size-4 text-emerald-300" />
                  {formState.deadline
                    ? format(formState.deadline, "PPP")
                    : "Select deadline"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-950/95 border-emerald-500/30">
                <Calendar
                  mode="single"
                  selected={formState.deadline ?? undefined}
                  onSelect={(value) => updateField("deadline", value ?? null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="reward"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
            >
              Reward (XP)
            </label>
            <Input
              id="reward"
              type="number"
              min={0}
              step={50}
              value={formState.reward}
              onChange={(event) => updateField("reward", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="target_url"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
            >
              Target URL
            </label>
            <Input
              id="target_url"
              type="url"
              placeholder="https://ops-glitch.target"
              value={formState.target_url}
              onChange={(event) =>
                updateField("target_url", event.target.value)
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="short_desc"
            className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
          >
            Short description
          </label>
          <Textarea
            id="short_desc"
            rows={3}
            placeholder="Summarize the mission briefing in one or two sentences."
            value={formState.short_desc}
            onChange={(event) => updateField("short_desc", event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300"
          >
            Full briefing
          </label>
          <Textarea
            id="description"
            rows={6}
            placeholder="Detail the contest narrative, scope, and in-scope assets."
            value={formState.description}
            onChange={(event) => updateField("description", event.target.value)}
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                Creators
              </p>
              <p className="text-xs text-slate-400">
                Credit the operatives powering this mission.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="self-start gap-2 border-emerald-500/40 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-400/25 sm:self-auto"
              onClick={addCreator}
            >
              <BadgePlus className="size-4" />
              Add creator
            </Button>
          </div>

          <div className="space-y-3">
            {creators.map((creator, index) => (
              <div
                key={`creator-${index}`}
                className="relative grid gap-4 rounded-xl border border-emerald-500/25 bg-slate-950/60 p-5 sm:grid-cols-2"
              >
                <div className="space-y-2">
                  <label className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Name
                  </label>
                  <Input
                    value={creator.creator_name}
                    onChange={(event) =>
                      handleCreatorChange(index, "creator_name", event.target.value)
                    }
                    placeholder="Creator display name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Social handle / ID
                  </label>
                  <Input
                    value={creator.social_Id}
                    onChange={(event) =>
                      handleCreatorChange(index, "social_Id", event.target.value)
                    }
                    placeholder="@creator_handle"
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-3 cursor-pointer rounded-full text-emerald-200 hover:text-emerald-100"
                  onClick={() => removeCreator(index)}
                  disabled={creators.length === 1 && !creator.creator_name && !creator.social_Id}
                >
                  <X className="size-4" />
                  <span className="sr-only">Remove creator</span>
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
              Requirements
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="Add requirement"
                value={requirementDraft}
                onChange={(event) => setRequirementDraft(event.target.value)}
                onKeyDown={handleRequirementKeyDown}
              />
              <Button
                type="button"
                variant="secondary"
                className="gap-2 cursor-pointer bg-emerald-500/25 text-emerald-100 hover:bg-emerald-400/35"
                onClick={addRequirement}
              >
                <Sparkle className="size-4" />
                Add requirement
              </Button>
            </div>
          </div>

          {requirements.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {requirements.map((item) => (
                <span
                  key={item}
                  className="group inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-emerald-100"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeRequirement(item)}
                    className="rounded-full border border-transparent p-1 text-emerald-200 transition hover:border-emerald-400/40 hover:bg-emerald-500/20"
                  >
                    <X className="size-3.5" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              No requirements added yet.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            className="cursor-pointer text-emerald-200 hover:text-emerald-100"
            onClick={() => router.push("/ui/controller/protected/admin-pannel")}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className={`gap-2 bg-emerald-500/25 text-emerald-100 hover:bg-emerald-400/35`}
            disabled={isSubmitDisabled}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <PlusCircle className="size-4" />
            )}
            {isEditing ? "Update Contest" : "Save Contest"}
          </Button>
        </div>

        {submitError ? (
          <p className="text-sm text-red-400">{submitError}</p>
        ) : null}
      </form>
    </div>
  );
};

export default CreateChallengePage;
