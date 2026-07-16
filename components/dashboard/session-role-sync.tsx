"use client";

import { useEffect, useRef } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/lib/queries/hooks";

/**
 * If the DB role diverges from the session cookie (e.g. after promote-admin),
 * sync cookies and refresh the App Router shell so the correct nav appears.
 */
export function SessionRoleSync() {
  const { data } = useProfile();
  const pathname = usePathname();
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (!data?.user?.id || ran.current) return;
    ran.current = true;

    void (async () => {
      try {
        const { data: sync } = await axios.post<{
          role: "USER" | "ADMIN";
          cookieUpdated: boolean;
          redirectTo: string;
        }>("/api/session/sync");

        if (!sync.cookieUpdated) return;

        router.refresh();

        const onAdminRoute = pathname.startsWith("/admin");
        if (sync.role === "ADMIN" && !onAdminRoute && pathname === "/dashboard") {
          router.replace(sync.redirectTo);
        } else if (sync.role === "USER" && onAdminRoute) {
          router.replace(sync.redirectTo);
        }
      } catch {
        // Ignore — user may be mid sign-out.
      }
    })();
  }, [data?.user?.id, pathname, router]);

  return null;
}
