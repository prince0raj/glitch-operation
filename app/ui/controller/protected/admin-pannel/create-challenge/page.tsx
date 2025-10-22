"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const CreateChallengePage = () => {
  const router = useRouter();
  const [formState, setFormState] = useState<ContestFormState>(initialState);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [requirementDraft, setRequirementDraft] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const isValid = useMemo(() => {
    if (formState.slug.length !== 4) return false;
    if (!formState.title.trim()) return false;
    if (!formState.short_desc.trim()) return false;
    if (!formState.description.trim()) return false;
    if (!difficulties.includes(formState.difficulty)) return false;
    if (!statuses.includes(formState.status)) return false;
    return true;
  }, [formState]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = {
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
      };

      console.log("Contest payload", payload);
      // TODO: Integrate with Supabase insert when API route is ready.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            // Launch new operation
          </p>
          <h1
            className={`${orbitron.className} text-3xl sm:text-4xl font-semibold tracking-[0.25em] uppercase text-emerald-100`}
          >
            Create Contest
          </h1>
          <p className="max-w-2xl text-sm text-slate-400">
            Define a new bug bounty mission, outline the scope, and set
            expectations for the hunters. All parameters must reflect the
            security schema for accurate deployment.
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
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <PlusCircle className="size-4" />
            )}
            Save Contest
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateChallengePage;
