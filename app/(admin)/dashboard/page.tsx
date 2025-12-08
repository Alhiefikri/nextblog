import { requireAuth } from "@/lib/auth-utils";

export default async function DashBoardPage() {
  await requireAuth();
  return (
    <div className="flex items-center justify-center w-full h-dvh">
      <h1>Dashboard Page</h1>
    </div>
  );
}
