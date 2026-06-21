"use server";

import { redirect } from "next/navigation";
import { checkAdminPassword, createAdminSession } from "@/lib/admin";
import { type ActionState } from "@/lib/forms";

export async function adminLogin(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  if (!checkAdminPassword(password)) {
    return { error: "Senha incorreta." };
  }
  await createAdminSession();
  redirect("/admin");
}
