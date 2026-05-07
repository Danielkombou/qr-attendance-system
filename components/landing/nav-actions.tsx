"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type NavActionsProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

const signInClasses =
  "px-6 py-5 text-sm";
const getStartedClasses =
  "bg-primary px-6 py-5 text-sm text-primary-foreground shadow-[0_18px_40px_-24px_rgba(10,14,38,0.8)] hover:-translate-y-0.5 hover:bg-primary/95";

export function NavActions({ mobile = false, onNavigate }: NavActionsProps) {
  return (
    <nav className={mobile ? "flex w-full flex-col gap-2" : "flex items-center gap-3"}>
      <Button
        render={<Link href="/sign-in" />}
        nativeButton={false}
        variant="ghost"
        onClick={onNavigate}
        className={
          mobile
            ? `w-full justify-center border border-border ${signInClasses}`
            : signInClasses
        }
      >
        Sign In
      </Button>
      <Button
        render={<Link href="/get-started" />}
        nativeButton={false}
        onClick={onNavigate}
        className={mobile ? `w-full justify-center ${getStartedClasses}` : getStartedClasses}
      >
        Get Started
      </Button>
    </nav>
  );
}
