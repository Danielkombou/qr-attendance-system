import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function GetStartedPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10"
    >
      <h1 className="text-[2rem] font-semibold">Create Account</h1>
      <p className="mt-2 text-muted-foreground">
        Sign up to start tracking your attendance.
      </p>
      <SignUpForm />
      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-foreground underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
