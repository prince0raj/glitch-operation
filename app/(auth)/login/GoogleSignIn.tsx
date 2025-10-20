"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { createClient } from "@/utils/supabase/client";
// import { toast } from "sonner";
import { Chrome, Loader } from "lucide-react";
import { SocialButton } from "./style";

export default function GoogleSignin() {
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const supabase = createClient();

  const searchParams = useSearchParams();

  const next = searchParams.get("next");

  async function signInWithGoogle() {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback${
            next ? `?next=${encodeURIComponent(next)}` : ""
          }`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      //   toast({
      //     title: "Please try again.",
      //     description: "There was an error logging in with Google.",
      //     variant: "destructive",
      //   });
      setIsGoogleLoading(false);
    }
  }

  return (
    <SocialButton
      type="button"
      onClick={signInWithGoogle}
      disabled={isGoogleLoading}
    >
      {isGoogleLoading ? (
        <Loader className="animate-spin" />
      ) : (
        <Chrome size={16} />
      )}
      Continue with Google
    </SocialButton>
  );
}
