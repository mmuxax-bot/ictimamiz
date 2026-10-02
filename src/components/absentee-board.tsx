import { rankAbsentees, useAppStore } from "@/lib/store";

export function AbsenteeBoard() {
  const people = useAppStore((s) => s.people);
  const records = useAppStore((s) => s.records);
  const hydrated = useAppStore((s) => s.hasHydrated);

  if (!hydrated) return null;

  const ranked = rankAbsentees(people, records);
  const max = Math.max(...ranked.map((r) => r.absences), 1);

  return (
    <section className="rounded-xl border border-border bg-surface/80 p-5 sm:p-6">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-kicker text-accent uppercase">
            Sıralama
          </p>
          <h2 className="mt-2 font-display text-2xl text-fg">Bütün adlar</h2>
        </div>
        <p className="text-xs text-subtle">Üzürsüz üstün tutulur</p>
      </div>
      {ranked.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
          Hələ ad əlavə edilməyib. Admin paneldən adlar buraya düşəcək.
        </p>
      ) : (
        <ol className="space-y-3">
          {ranked.map((row, i) => (
            <li key={row.person.id} className="grid grid-cols-[1.5rem_1fr_auto] items-center gap-3">
              <span className="font-display text-lg text-muted tabular-nums">{i + 1}</span>
              <div className="min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="break-words font-medium text-fg">{row.person.name}</p>
                  <p className="shrink-0 text-xs text-muted tabular-nums">
                    {row.unexcused} üzürsüz · {row.excused} üzürlü
                  </p>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-elevated">
                  <div
                    className="h-full rounded-full bg-absent/80"
                    style={{
                      width: row.absences === 0 ? "0%" : `${Math.max(8, (row.absences / max) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              <span className="font-display text-xl text-fg tabular-nums">{row.absences}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}