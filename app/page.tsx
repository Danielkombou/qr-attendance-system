import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ButtonLink } from "@/components/button-link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--page-bg)] text-[var(--brand-ink)]">
      <section className="relative flex min-h-screen w-full flex-col overflow-hidden">
        <div className="hero-glow hero-glow-left" />
        <div className="hero-glow hero-glow-right" />

        <header className="relative z-10 w-full border-b border-[var(--border-soft)] bg-white/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
            <BrandLogo />
            <nav className="flex items-center gap-2 sm:gap-3">
              <ButtonLink href="/sign-in" variant="ghost" className="px-4">
                Sign In
              </ButtonLink>
              <ButtonLink href="/get-started" className="px-5">
                Get Started
              </ButtonLink>
            </nav>
          </div>
        </header>

        <div className="relative z-10 flex flex-1 items-center">
          <div className="mx-auto flex w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
            <div className="flex w-full flex-col items-center text-center">
              <p className="mb-6 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-accent)]">
                Smart attendance for modern teams
              </p>

              <h1 className="max-w-5xl text-5xl font-semibold leading-[0.96] tracking-[-0.06em] sm:text-6xl lg:text-8xl">
                Smart Attendance Tracking Made Simple
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted-ink)] sm:text-xl">
                Monitor presence, record arrival times, understand how long
                people stay, and manage attendance from one clean platform.
              </p>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
                <ButtonLink
                  href="/get-started"
                  className="min-w-48 gap-2 px-7 py-4 text-base"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink
                  href="/sign-in"
                  variant="ghost"
                  className="min-w-40 border border-[var(--border-soft)] bg-white/70 px-7 py-4 text-base"
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
