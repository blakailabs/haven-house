"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/portal/Sidebar";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['resident']}>
      <div className="flex min-h-[calc(100vh-64px)] bg-zinc-50 dark:bg-black">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
