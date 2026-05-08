import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
      <h1 className="text-[2rem] font-semibold">Sign In</h1>
      <p className="mt-2 text-muted-foreground">
        Access your AttendX dashboard and attendance records.
      </p>
      <form className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-5">
        <label className="grid gap-1.5">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            className="h-11 rounded-lg border border-border bg-input-background px-3"
            placeholder="you@company.com"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            className="h-11 rounded-lg border border-border bg-input-background px-3"
            placeholder="********"
          />
        </label>
        <Button className="h-11 w-full">Sign In</Button>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">
        No account yet?{" "}
        <Link href="/get-started" className="font-medium text-foreground underline">
          Get started
        </Link>
      </p>
    </main>
  );
}
