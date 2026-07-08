import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Role } from "@/lib/roles";

export default async function TeamPage() {
  const jar = await cookies();
  const role = jar.get("attendx_role")?.value;
  redirect(role === Role.ADMIN ? "/admin/users" : "/dashboard");
}
