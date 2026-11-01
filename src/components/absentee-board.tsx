import { rankAbsentees, useAppStore } from "@/lib/store";

export function AbsenteeBoard() {
  const people = useAppStore((s) => s.people);
  const records = useAppStore((s) => s.records);
  const hydrated = useAppStore((s) => s.hasHydrated);

  if (!hydrated) return <SectionSkeleton />;

  const ranked = rankAbsentees(people, records);
  const max = Math.max(...ranked.map((r) => r.absences), 1);

  return (
    <section className="card-premium p-6 sm:p-8">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-kicker text-accent uppercase">
            Sıralama
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-fg">Bütün adlar</h2>
        </div>
        <p className="text-xs text-subtle">Üzürsüz üstün tutulur</p>
      </div>
      {ranked.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border/80 bg-bg/30 px-6 py-10 text-center text-sm text-muted">
          Hələ ad əlavə edilməyib. Admin paneldən adlar buraya düşəcək.
        </p>
      ) : (
        <ol className="space-y-3">
          {ranked.map((row, i) => (
            <li key={row.person.id} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-lg px-1 py-1.5 transition-colors hover:bg-elevated/40">
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
function SectionSkeleton() {
  return (
    <section className="card-premium space-y-4 p-6 sm:p-8" aria-busy="true">
      <div className="skeleton h-3 w-20" />
      <div className="skeleton h-7 w-40" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-5/6" />
    </section>
  );
}
