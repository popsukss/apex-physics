"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n";

interface VoteButtonProps {
  targetId: string;
  targetType: "post" | "comment";
  initialCount: number;
  initialUserVote: 1 | -1 | 0;
}

export function VoteButton({
  targetId,
  targetType,
  initialCount,
  initialUserVote,
}: VoteButtonProps) {
  const supabase = createClient();
  const { t } = useLanguage();
  const [count, setCount] = useState(initialCount);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [loading, setLoading] = useState(false);

  const handleVote = async () => {
    setLoading(true);

    try {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        alert(t("community.vote_sign_in"));
        setLoading(false);
        return;
      }

      if (userVote === 1) {
        await supabase
          .from("votes")
          .delete()
          .eq("user_id", authData.user.id)
          .eq("target_id", targetId)
          .eq("target_type", targetType);

        setCount(count - 1);
        setUserVote(0);
      } else {
        const voteData = {
          user_id: authData.user.id,
          target_id: targetId,
          target_type: targetType,
          value: 1,
        };

        await supabase.from("votes").upsert(
          [voteData as never],
          {
            onConflict: "user_id,target_id,target_type",
          }
        );

        const increment = userVote === -1 ? 2 : 1;
        setCount(count + increment);
        setUserVote(1);
      }
    } catch (error) {
      console.error("Vote error:", error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors outline-none",
        userVote === 1
          ? "bg-primary/10 text-primary hover:bg-primary/20"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus-visible:ring-2 focus-visible:ring-ring/50"
      )}
    >
      <ChevronUp className={cn("size-4", userVote === 1 && "fill-current")} />
      <span>{count}</span>
    </button>
  );
}
