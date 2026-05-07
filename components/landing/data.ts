import { BarChart3, Clock3, QrCode, Shield, type LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";

export type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type StatItem = {
  value: string;
  label: string;
  detail: string;
  style: CSSProperties;
};

export const features: FeatureItem[] = [
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

export const valuePoints = [
  "Eliminate manual attendance tracking",
  "Generate automated reports",
  "Secure and reliable",
  "Reduce time theft and buddy punching",
  "Mobile-friendly interface",
  "Easy to implement",
];

export const stats: StatItem[] = [
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
