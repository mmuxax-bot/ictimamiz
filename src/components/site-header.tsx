import { formatFridayDate, isoWeekId } from "@/lib/week";
import { useToday } from "@/components/use-today";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const syncCopy = {
  idle: { label: "Hazırlanır", dot: "bg-subtle" },
  syncing: { label: "Sinxronlaşır", dot: "bg-excused animate-pulse" },
  online: { label: "Canlı", dot: "bg-present" },
  offline: { label: "Oflayn", dot: "bg-absent" },
} as const;

export function SiteHeader() {
  const today = useToday();
  const status = useAppStore((s) => s.syncStatus);
  const weekLabel = today ? formatFridayDate(isoWeekId(today)) : " ";
  const sync = syncCopy[status];

  return (
    <header className="rise flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-border/70 bg-surface/60 px-3 py-1.5 backdrop-blur">
          <span className="star-mark" aria-hidden="true" />
          <span className="text-[11px] font-semibold tracking-kicker text-accent uppercase">
            Həftəlik qayıb dəftəri
          </span>
        </div>
        <span
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/60 px-3 py-1.5 text-[11px] font-medium text-muted"
          aria-live="polite"
        >
          <span className={cn("size-1.5 rounded-full", sync.dot)} />
          {sync.label}
        </span>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="font-display text-6xl font-semibold leading-none tracking-tight text-fg sm:text-7xl">
          İctima
        </h1>
        <p className="font-display text-lg text-muted italic sm:pb-2">{weekLabel}</p>
      </div>
      <div className="divider-ornament text-xs" aria-hidden="true">
        ✦
      </div>
    </header>
  );
}
