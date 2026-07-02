"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignOut() {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await axios.post("/api/onboarding/sign-out");
    },
    onMutate: () => {
      return { toastId: toast.loading("Signing out…") };
    },
    onSuccess: (_data, _vars, context) => {
      toast.success("Signed out", { id: context?.toastId });
      router.push("/sign-in");
      router.refresh();
    },
    onError: (_error, _vars, context) => {
      toast.error("Could not sign out", { id: context?.toastId });
    },
  });
}
