"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createQueryClient } from "@/lib/queries/query-client";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delay={0}>{children}</TooltipProvider>
    </QueryClientProvider>
  );
}
