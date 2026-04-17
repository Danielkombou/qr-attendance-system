import { ArrowRight, CheckCircle2 } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ButtonLink } from "@/components/button-link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--page-bg)] text-[var(--brand-ink)]">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-10 pt-5 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between rounded-[28px] border border-[var(--border-soft)] bg-white/88 px-4 py-4 shadow-[0_18px_50px_-38px_rgba(10,14,38,0.6)] backdrop-blur sm:px-6">
          <BrandLogo />
          <nav className="flex items-center gap-2 sm:gap-3">
            <ButtonLink href="/sign-in" variant="ghost" className="px-4">
              Sign In
            </ButtonLink>
            <ButtonLink href="/get-started" className="px-5">
              Get Started
            </ButtonLink>
          </nav>
        </header>

        <div className="relative flex flex-1 items-center overflow-hidden rounded-[40px] px-1 py-14 sm:py-20 lg:px-4">
          <div className="absolute inset-x-12 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(10,14,38,0.12),transparent)]" />
          <div className="absolute left-0 top-14 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(198,214,255,0.5),transparent_68%)] blur-2xl" />
          <div className="absolute bottom-8 right-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(231,236,255,0.82),transparent_62%)] blur-3xl" />

          <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white/90 px-4 py-2 text-sm font-medium text-[var(--muted-ink)] shadow-[0_12px_30px_-24px_rgba(10,14,38,0.65)]">
              <CheckCircle2 className="h-4 w-4 text-[var(--brand-accent)]" />
              Reliable presence tracking for modern teams and schools
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.06em] text-[var(--brand-ink)] sm:text-6xl lg:text-8xl">
              Smart Attendance Tracking Made Simple
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-[var(--muted-ink)] sm:text-xl">
              Monitor presence, record arrival times, understand how long people
              stay, and keep attendance workflows organized from one clean
              platform.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <ButtonLink
                href="/get-started"
                className="min-w-48 gap-2 px-7 py-4 text-base"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href="/sign-in"
                variant="ghost"
                className="min-w-40 border border-[var(--border-soft)] bg-white/80 px-7 py-4 text-base"
              >
                Sign In
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
