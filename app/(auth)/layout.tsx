import Link from "next/link";
import { Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-svh">
      <div className="absolute left-3 top-3 z-10 sm:left-6 sm:top-6">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-2 bg-card/90 backdrop-blur-sm",
          )}
        >
          <Home className="h-4 w-4 shrink-0" aria-hidden />
          Home
        </Link>
      </div>
      {children}
    </div>
  );
}
