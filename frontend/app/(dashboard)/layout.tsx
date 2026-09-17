import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ClientLayout from "./ClientLayout";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  console.log("================= SESSION DEBUG =================");
  console.log("Session:", session);
  console.log("=================================================");

  if (!session) {
    console.log("REDIRECTING TO LOGIN!");
    redirect("/login");
  }

  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}
