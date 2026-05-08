import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
      <h1 className="text-[2rem] font-semibold">Sign In</h1>
      <p className="mt-2 text-muted-foreground">
        Access your AttendX dashboard and attendance records.
      </p>
      <SignInForm />
      <p className="mt-4 text-sm text-muted-foreground">
        No account yet?{" "}
        <Link href="/get-started" className="font-medium text-foreground underline">
          Get started
        </Link>
      </p>
    </main>
  );
}
