import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ButtonLink } from "@/components/button-link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--page-bg)] text-[var(--brand-ink)]">
      <section className="relative flex min-h-screen w-full flex-col overflow-hidden">
        <div className="hero-glow hero-glow-left" />
        <div className="hero-glow hero-glow-right" />

        <header className="relative z-10 w-full border-b border-[var(--border-soft)] bg-[var(--surface)] backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-5 lg:px-10">
            <BrandLogo className="min-w-0" />
            <nav className="flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-3">
              <ThemeToggle />
              <ButtonLink
                href="/sign-in"
                variant="ghost"
                className="px-3 text-[0.95rem] sm:px-4 sm:text-sm"
              >
                Sign In
              </ButtonLink>
              <ButtonLink
                href="/get-started"
                className="px-3.5 text-[0.95rem] sm:px-5 sm:text-sm"
              >
                Get Started
              </ButtonLink>
            </nav>
          </div>
        </header>

        <div className="relative z-10 flex flex-1 items-center">
          <div className="mx-auto flex w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-10 lg:py-32">
            <div className="flex w-full flex-col items-center text-center">
              <p className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--brand-accent)] sm:mb-6 sm:text-sm">
                Smart attendance for modern teams
              </p>

              <h1 className="max-w-5xl text-[clamp(2.75rem,8vw,6.75rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-balance">
                Smart Attendance Tracking Made Simple
              </h1>

              <p className="mt-5 max-w-[42rem] text-base leading-7 text-[var(--muted-ink)] sm:mt-6 sm:text-lg sm:leading-8 lg:text-xl">
                Monitor presence, record arrival times, understand how long
                people stay, and manage attendance from one clean platform.
              </p>

              <div className="mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
                <ButtonLink
                  href="/get-started"
                  className="min-w-48 gap-2 px-6 py-4 text-base"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink
                  href="/sign-in"
                  variant="ghost"
                  className="min-w-40 border border-[var(--border-soft)] bg-[var(--surface)] px-6 py-4 text-base"
                >
                  Sign In
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
