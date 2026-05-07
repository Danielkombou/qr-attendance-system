"use client";

import { motion } from "motion/react";
import type { FeatureItem } from "@/components/landing/data";

type FeatureCardProps = {
  feature: FeatureItem;
  index: number;
  reduceMotion: boolean | null;
};

export function FeatureCard({ feature, index, reduceMotion }: FeatureCardProps) {
  const FeatureIcon = feature.icon;

  return (
    <motion.article
      initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
      transition={
        reduceMotion
          ? undefined
          : { duration: 0.35, ease: "easeOut", delay: index * 0.06 }
      }
      viewport={{ once: true, amount: 0.25 }}
      className="rounded-xl border border-(--border-soft) bg-[#f5f5f7] px-5 py-6 text-center shadow-[0_8px_24px_-20px_rgba(10,14,38,0.4)] sm:px-6"
    >
      <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#e3e4e8] text-(--brand-ink)">
        <FeatureIcon className="h-[18px] w-[18px]" />
      </span>
      <h3 className="mt-5 text-[1.45rem] font-semibold tracking-[-0.03em] sm:text-[1.65rem]">
        {feature.title}
      </h3>
      <p className="mx-auto mt-2 max-w-[18rem] text-base leading-[1.35] text-(--muted-ink) sm:text-[1.05rem]">
        {feature.description}
      </p>
    </motion.article>
  );
}
