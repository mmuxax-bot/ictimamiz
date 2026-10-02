import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminGate } from "@/components/admin-gate";
import { AdminPanel } from "@/components/admin-panel";
import { ADMIN_SESSION_KEY } from "@/lib/store";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(ADMIN_SESSION_KEY) === "1");
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="min-h-dvh bg-bg" />;
  }

  if (!unlocked) {
    return <AdminGate onUnlock={() => setUnlocked(true)} />;
  }

  return <AdminPanel onLock={() => setUnlocked(false)} />;
}
