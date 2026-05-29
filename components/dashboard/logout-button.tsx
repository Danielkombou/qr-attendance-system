"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { sidebarActionRowClass } from "@/lib/ui/sidebar-action-styles";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
  variant?: "sidebar" | "icon";
};

const logoutDestructiveClass =
  "text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive/30 dark:hover:bg-destructive/15";

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
        className={cn(
          "size-9 border-destructive/35 text-destructive hover:bg-destructive/10 hover:text-destructive",
          className,
        )}
        disabled={submitting}
        onClick={() => void handleLogout()}
        aria-label={submitting ? "Signing out" : "Sign out"}
      >
        <LogOut className="h-4 w-4 shrink-0" aria-hidden />
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
        sidebarActionRowClass,
        "justify-start",
        logoutDestructiveClass,
        className,
      )}
    >
      <LogOut className="h-4 w-4 shrink-0" aria-hidden />
      <span>{submitting ? "Signing out…" : "Sign out"}</span>
    </Button>
  );
}
