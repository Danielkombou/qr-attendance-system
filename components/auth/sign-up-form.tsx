"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.length < 8) {
      toast.warning("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Creating your account…");

    try {
      await axios.post("/api/onboarding/sign-up", { name, email, password });
      toast.success("Account created", {
        id: toastId,
        description: "You can sign in now.",
      });
      router.push("/sign-in");
      router.refresh();
    } catch (err) {
      const fallback = "Unexpected sign up error.";
      const message =
        err instanceof AxiosError
          ? (err.response?.data as { error?: string } | undefined)?.error ?? fallback
          : fallback;
      toast.error("Sign up failed", { id: toastId, description: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-5"
    >
      <label className="grid gap-1.5">
        <span className="text-sm font-medium">Full Name</span>
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Jane Doe"
          className="h-11 rounded-lg border border-border bg-input-background px-3"
        />
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-medium">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          className="h-11 rounded-lg border border-border bg-input-background px-3"
        />
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-medium">Password</span>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          className="h-11 rounded-lg border border-border bg-input-background px-3"
        />
      </label>
      <Button type="submit" className="h-11 w-full" disabled={submitting}>
        {submitting ? "Creating..." : "Create Account"}
      </Button>
    </form>
  );
}
