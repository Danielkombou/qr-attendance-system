"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { NavActions } from "@/components/landing/nav-actions";
import { cn } from "@/lib/utils";

export function SiteNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeMenuOnDesktop = () => {
      if (window.innerWidth >= 640) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", closeMenuOnDesktop);
    return () => window.removeEventListener("resize", closeMenuOnDesktop);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-[background-color,backdrop-filter,box-shadow,border-color] duration-300 ease-out",
        "text-foreground",
        scrolled
          ? [
              "border-border/70 backdrop-blur-xl backdrop-saturate-150",
              "bg-white/50 shadow-[0_8px_30px_-20px_rgba(15,23,42,0.18)]",
              "dark:border-border/50 dark:bg-background/40 dark:shadow-[0_8px_30px_-20px_rgba(0,0,0,0.45)]",
            ]
          : "border-transparent bg-transparent backdrop-blur-sm",
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-10">
        <div className="flex w-full items-center justify-between gap-3">
          <BrandLogo className="min-w-0" />
          <div className="hidden sm:block">
            <NavActions />
          </div>
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-lg border sm:hidden",
              "border-border/80 text-foreground",
              "hover:bg-white/60 dark:hover:bg-white/10",
            )}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div
            id="mobile-menu"
            className={cn(
              "mt-3 rounded-2xl border p-3 sm:hidden",
              "border-border/80 bg-white/75 backdrop-blur-xl",
              "dark:border-border/60 dark:bg-background/75",
            )}
          >
            <NavActions mobile onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        ) : null}
      </div>
    </header>
  );
}
