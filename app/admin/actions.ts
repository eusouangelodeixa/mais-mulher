"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, destroyAdminSession } from "@/lib/admin";
import { resendActivation } from "@/lib/leads";

export async function resendAccessAction(formData: FormData) {
  await requireAdmin();
  const leadId = String(formData.get("leadId") ?? "");
  if (leadId) await resendActivation(leadId);
  revalidatePath("/admin");
}

export async function adminLogout() {
  await destroyAdminSession();
  redirect("/admin/login");
}
