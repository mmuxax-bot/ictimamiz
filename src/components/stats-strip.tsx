import { useAppStore } from "@/lib/store";
import { isoWeekId } from "@/lib/week";
import { useToday } from "@/components/use-today";

export function StatsStrip() {
  const people = useAppStore((s) => s.people);
  const records = useAppStore((s) => s.records);
  const hydrated = useAppStore((s) => s.hasHydrated);
  const today = useToday();
  if (!hydrated || !today) return null;

  const weekId = isoWeekId(today);
  const week = records.filter((r) => r.weekId === weekId);
  const tiles = [
    { label: "Adlar", value: people.length, tone: "text-fg" },
    { label: "İştirak", value: week.filter((r) => r.status === "present").length, tone: "text-present" },
    { label: "Üzürlü", value: week.filter((r) => r.status === "excused").length, tone: "text-excused" },
    { label: "Üzürsüz", value: week.filter((r) => r.status === "unexcused").length, tone: "text-absent" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Bu həftənin xülasəsi">
      {tiles.map((t) => (
        <div key={t.label} className="stat-tile">
          <p className="text-[11px] font-medium tracking-kicker text-subtle uppercase">{t.label}</p>
          <p className={`mt-1 font-display text-3xl font-semibold tabular-nums ${t.tone}`}>{t.value}</p>
        </div>
      ))}
    </div>
  );
}
