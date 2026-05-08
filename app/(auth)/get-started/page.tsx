import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GetStartedPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
      <h1 className="text-[2rem] font-semibold">Create Account</h1>
      <p className="mt-2 text-muted-foreground">
        Open signup is enabled. You can request to join your organization after registration.
      </p>
      <form className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-5">
        <label className="grid gap-1.5">
          <span className="text-sm font-medium">Full Name</span>
          <input className="h-11 rounded-lg border border-border bg-input-background px-3" />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-medium">Email</span>
          <input type="email" className="h-11 rounded-lg border border-border bg-input-background px-3" />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-medium">Password</span>
          <input type="password" className="h-11 rounded-lg border border-border bg-input-background px-3" />
        </label>
        <Button className="h-11 w-full">Create Account</Button>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-foreground underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
