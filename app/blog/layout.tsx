import { NavMenu } from "@/components/navbar";
import { authSession } from "@/lib/auth-utils";
import React from "react";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await authSession();
  return (
    <>
      <div className="relative w-full">
        <NavMenu name={session?.user.name} />
        {children}
      </div>
    </>
  );
}
