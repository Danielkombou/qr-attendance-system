import {
  ArrowRight,
  BarChart3,
  Check,
  Clock3,
  Headset,
  QrCode,
  Shield,
  Users,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ButtonLink } from "@/components/button-link";
import { ThemeToggle } from "@/components/theme-toggle";

const features = [
  {
    title: "QR Code Check-In",
    description: "Fast and secure attendance tracking with QR codes.",
    icon: QrCode,
  },
  {
    title: "Real-Time Tracking",
    description: "Monitor presence and working hours in real-time.",
    icon: Clock3,
  },
  {
    title: "Advanced Analytics",
    description: "Detailed reports and attendance insights at a glance.",
    icon: BarChart3,
  },
  {
    title: "Role-Based Access",
    description: "Separate views and actions for employees and admins.",
    icon: Shield,
  },
];

const valuePoints = [
  "Eliminate manual attendance tracking",
  "Generate automated reports",
  "Secure and reliable",
  "Reduce time theft and buddy punching",
  "Mobile-friendly interface",
  "Easy to implement",
];

const stats = [
  {
    value: "98%",
    label: "Accuracy Rate",
    detail: "Industry-leading precision",
    style: {
      background: "var(--stat-green-bg)",
      color: "var(--stat-green-ink)",
    },
  },
  {
    value: "50K+",
    label: "Active Users",
    detail: "Trusted by organizations",
    style: {
      background: "var(--stat-blue-bg)",
      color: "var(--stat-blue-ink)",
    },
  },
  {
    value: "24/7",
    label: "Support",
    detail: "Always here to help",
    style: {
      background: "var(--stat-violet-bg)",
      color: "var(--stat-violet-ink)",
    },
  },
];

export default function Home() {
  return (
    <main
      className="min-h-screen text-[var(--brand-ink)]"
      style={{ background: "var(--page-bg)" }}
    >
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
          <div className="mx-auto flex w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-10 lg:py-32">
            <div className="flex w-full flex-col items-center text-center">
              <p className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--brand-accent)] sm:mb-6 sm:text-sm">
                Smart attendance for modern teams
              </p>

              <h1 className="max-w-5xl text-[clamp(2.75rem,8vw,6.75rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-balance">
                Smart Attendance Tracking Made Simple
              </h1>

              <p className="mt-5 max-w-[42rem] text-base leading-7 text-[var(--muted-ink)] sm:mt-6 sm:text-lg sm:leading-8 lg:text-xl">
                Monitor presence, track working hours, and gain insights with
                AttendX - the modern solution for organizations of all sizes.
              </p>

              <div className="mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
                <ButtonLink
                  href="/get-started"
                  className="min-w-48 gap-2 px-6 py-4 text-base"
                >
                  Start Free Trial
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

      <section className="border-t border-[var(--border-soft)] bg-[var(--section-bg)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
          <h2 className="text-center text-3xl font-semibold tracking-[-0.02em] sm:text-[2.1rem]">
            Powerful Features
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const FeatureIcon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-card)] p-5 text-center shadow-[0_18px_40px_-35px_rgba(10,14,38,0.55)]"
                >
                  <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--chip-bg)] text-[var(--brand-ink)]">
                    <FeatureIcon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-base leading-7 text-[var(--muted-ink)]">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[var(--section-muted-bg)]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center lg:gap-14 lg:px-10 lg:py-20">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.02em] sm:text-[2.1rem]">
              Why Choose AttendX?
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-[var(--muted-ink)]">
              Our platform combines modern technology with a user-friendly
              design to deliver a seamless attendance tracking experience.
            </p>
            <ul className="mt-7 grid gap-4 text-[1.05rem] sm:grid-cols-2">
              {valuePoints.map((point) => (
                <li key={point} className="flex items-start gap-2.5 font-medium">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-card)] p-6 shadow-[0_30px_60px_-45px_rgba(10,14,38,0.55)] sm:p-8">
            <ul className="space-y-6">
              {stats.map((stat) => (
                <li key={stat.label} className="flex items-center gap-4 sm:gap-5">
                  <span
                    className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-semibold"
                    style={stat.style}
                  >
                    {stat.value}
                  </span>
                  <span>
                    <span className="block text-2xl font-semibold leading-7">
                      {stat.label}
                    </span>
                    <span className="mt-1 block text-base text-[var(--muted-ink)]">
                      {stat.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-y border-[var(--border-soft)] bg-[var(--section-bg)]">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] sm:text-[2.45rem]">
            Ready to Transform Your Attendance Tracking?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-[var(--muted-ink)] sm:text-[1.75rem]">
            Join thousands of organizations using AttendX
          </p>
          <ButtonLink
            href="/get-started"
            className="mt-9 inline-flex min-w-56 gap-2 px-8 py-4 text-2xl sm:text-[1.75rem]"
          >
            Get Started Now
            <ArrowRight className="h-5 w-5" />
          </ButtonLink>
        </div>
      </section>

      <footer className="bg-[var(--section-bg)]">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 text-center text-sm text-[var(--muted-ink)] sm:px-6 lg:px-10">
            <p>© 2026 AttendX. All rights reserved.</p>
          </div>
      </footer>
    </main>
  );
}
