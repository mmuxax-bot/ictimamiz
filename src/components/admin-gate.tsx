import { useState, type FormEvent } from "react";
import { ADMIN_CODE, ADMIN_SESSION_KEY } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AdminGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (code.trim() === ADMIN_CODE) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
      onUnlock();
      return;
    }
    setError(true);
    setShake(true);
    window.setTimeout(() => setShake(false), 400);
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className={cn(
          "w-full max-w-sm rounded-xl border border-border bg-surface p-6 sm:p-8",
          shake && "shake",
        )}
      >
        <p className="text-xs font-medium tracking-kicker text-accent uppercase">İctima</p>
        <h1 className="mt-3 font-display text-3xl text-fg">Giriş</h1>
        <p className="mt-2 text-sm text-muted">Admin kodunu daxil edin.</p>
        <label className="mt-6 block text-sm font-medium text-fg" htmlFor="admin-code">
          Kod
        </label>
        <Input
          id="admin-code"
          type="password"
          autoComplete="current-password"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          className="mt-2"
          aria-invalid={error}
        />
        {error ? (
          <p className="mt-2 text-sm text-absent">Kod səhvdir.</p>
        ) : (
          <p className="mt-2 h-5 text-sm" />
        )}
        <Button type="submit" className="mt-4 w-full">
          Daxil ol
        </Button>
      </form>
    </div>
  );
}
