"use client";

import { useRef } from "react";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { FeatureCard } from "@/components/landing/feature-card";
import { SiteNavbar } from "@/components/landing/site-navbar";
import { features, stats, valuePoints } from "@/components/landing/data";
import { Button } from "@/components/ui/button";
import { FeedbackWidget } from "@/components/feedback-widget";
import { useReducedMotion } from "motion/react";

export default function Home() {
  const reduceMotion = useReducedMotion();
  const ctaRef = useRef<HTMLDivElement>(null);

  return (
    <main id="main-content" className="min-h-screen text-foreground" tabIndex={-1}>
      <SiteNavbar />

      <section className="relative w-full">
        <div className="relative flex min-h-[calc(82vh-5rem)] items-center">
          <div className="mx-auto flex w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
            <div className="flex w-full flex-col items-center text-center">
              <p className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground sm:mb-6 sm:text-sm">
                Smart attendance for modern teams
              </p>

              <h1 className="max-w-5xl text-[clamp(2.1rem,8.5vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-balance">
                Smart Attendance Tracking Made Simple
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground sm:mt-6 sm:text-base sm:leading-7 lg:text-lg">
                Monitor presence, track working hours, and gain insights with
                AttendX - the modern solution for organizations of all sizes.
              </p>

              <div
                ref={ctaRef}
                className="mt-7 flex w-full max-w-md flex-col items-stretch gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4"
              >
                <Button
                  render={<Link href="/get-started" />}
                  nativeButton={false}
                  className="w-full min-w-48 gap-2 bg-primary px-6 py-5 text-base text-primary-foreground shadow-[0_18px_40px_-24px_rgba(10,14,38,0.8)] hover:-translate-y-0.5 hover:bg-primary/95 sm:w-auto sm:py-6"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <h2 className="text-center text-2xl font-semibold tracking-[-0.02em] sm:text-[2.1rem]">
            Powerful Features
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={index}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 backdrop-blur-sm">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center lg:gap-14 lg:px-10 lg:py-20">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-[2.1rem]">
              Why Choose AttendX?
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Our platform combines modern technology with a user-friendly
              design to deliver a seamless attendance tracking experience.
            </p>
            <ul className="mt-7 grid gap-4 text-base sm:grid-cols-2 sm:text-[1.05rem]">
              {valuePoints.map((point) => (
                <li key={point} className="flex items-start gap-2.5 font-medium">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-6 shadow-[0_30px_60px_-45px_rgba(10,14,38,0.55)] sm:p-8">
            <ul className="space-y-6">
              {stats.map((stat) => (
                <li key={stat.label} className="flex items-center gap-3 sm:gap-5">
                  <span
                    className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-semibold"
                    style={stat.style}
                  >
                    {stat.value}
                  </span>
                  <span>
                    <span className="block text-xl font-semibold leading-7 sm:text-2xl">
                      {stat.label}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground sm:text-base">
                      {stat.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-4xl px-4 py-14 text-center sm:px-6 lg:py-16">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-[2.1rem]">
            Ready to Transform Your Attendance Tracking?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Join thousands of organizations using AttendX
          </p>
          <Button
            render={<Link href="/get-started" />}
            nativeButton={false}
            className="mt-8 inline-flex w-full min-w-56 gap-2 bg-primary px-8 py-5 text-base text-primary-foreground shadow-[0_18px_40px_-24px_rgba(10,14,38,0.8)] hover:-translate-y-0.5 hover:bg-primary/95 sm:w-auto sm:py-6 sm:text-lg"
          >
            Get Started Now
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      <footer className="border-t border-border bg-background/75 backdrop-blur-md">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6 lg:px-10">
            <p>© 2026 AttendX. All rights reserved.</p>
          </div>
      </footer>

      <FeedbackWidget variant="landing" ctaAnchorRef={ctaRef} />
    </main>
  );
}
