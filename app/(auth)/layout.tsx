import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6">
        <Button
          render={<Link href="/" />}
          nativeButton={false}
          variant="outline"
          size="sm"
          className="gap-2 bg-card/90 backdrop-blur-sm"
        >
          <Home className="h-4 w-4 shrink-0" aria-hidden />
          Home
        </Button>
      </div>
      {children}
    </div>
  );
}
