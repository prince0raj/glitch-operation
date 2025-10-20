import { createClient } from "@/utils/supabase/client";
import { Github, Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { SocialButton, SocialButtons } from "./style";

const GithubSignIn = () => {
  const [isGithubLoading, setIsGithubLoading] = useState<boolean>(false);
  const supabase = createClient();

  const searchParams = useSearchParams();

  const next = searchParams.get("next");

  async function signInWithGithub() {
    setIsGithubLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
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
      setIsGithubLoading(false);
    }
  }
  return (
    <SocialButton
      type="button"
      onClick={signInWithGithub}
      disabled={isGithubLoading}
    >
      {isGithubLoading ? (
        <Loader className="animate-spin" />
      ) : (
        <Github size={16} />
      )}
      Continue with GitHub
    </SocialButton>
  );
};

export default GithubSignIn;
