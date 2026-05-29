"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
  variant?: "sidebar" | "icon";
};

export function LogoutButton({ className, variant = "sidebar" }: LogoutButtonProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleLogout() {
    setSubmitting(true);
    const toastId = toast.loading("Signing out…");
    try {
      await axios.post("/api/onboarding/sign-out");
      toast.success("Signed out", { id: toastId });
      router.push("/sign-in");
      router.refresh();
    } catch {
      toast.error("Could not sign out", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  }

  if (variant === "icon") {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className={cn("size-9", className)}
        disabled={submitting}
        onClick={() => void handleLogout()}
        aria-label="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={submitting}
      onClick={() => void handleLogout()}
      className={cn(
        "h-10 w-full justify-start gap-2 rounded-xl px-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground",
        className,
      )}
    >
      <LogOut className="h-4 w-4 shrink-0" />
      {submitting ? "Signing out…" : "Sign out"}
    </Button>
  );
}
