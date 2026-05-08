"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationSlug, setOrganizationSlug] = useState("");
  const [joinMessage, setJoinMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/onboarding/sign-up", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          organizationSlug: organizationSlug.trim() || undefined,
          joinMessage: joinMessage.trim() || undefined,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "Unable to create account");
        return;
      }
      router.push("/sign-in");
      router.refresh();
    } catch {
      setError("Unexpected sign up error.");
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
          className="h-11 rounded-lg border border-border bg-input-background px-3"
        />
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-medium">Organization Slug (optional)</span>
        <input
          value={organizationSlug}
          onChange={(event) => setOrganizationSlug(event.target.value)}
          placeholder="acme-inc"
          className="h-11 rounded-lg border border-border bg-input-background px-3"
        />
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-medium">Join Message (optional)</span>
        <textarea
          value={joinMessage}
          onChange={(event) => setJoinMessage(event.target.value)}
          rows={3}
          className="rounded-lg border border-border bg-input-background px-3 py-2"
          placeholder="I'd like to join the engineering team..."
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button className="h-11 w-full" disabled={submitting}>
        {submitting ? "Creating..." : "Create Account"}
      </Button>
    </form>
  );
}
