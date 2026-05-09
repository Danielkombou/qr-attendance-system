"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await axios.post<{ error?: string; redirectTo?: string }>(
        "/api/onboarding/sign-in",
        { email, password },
      );
      const payload = response.data;
      router.push(payload.redirectTo ?? "/dashboard");
      router.refresh();
    } catch (error) {
      const fallback = "Unexpected sign in error.";
      if (error instanceof AxiosError) {
        setError((error.response?.data as { error?: string } | undefined)?.error ?? fallback);
      } else {
        setError(fallback);
      }
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
        <span className="text-sm font-medium">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 rounded-lg border border-border bg-input-background px-3"
          placeholder="you@company.com"
        />
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-medium">Password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 rounded-lg border border-border bg-input-background px-3"
          placeholder="********"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" className="h-11 w-full" disabled={submitting}>
        {submitting ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}
