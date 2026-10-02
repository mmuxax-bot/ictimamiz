import { findRecord, useAppStore, type AttendanceStatus } from "@/lib/store";
import {
  WEEKDAYS,
  addDays,
  formatFridayDate,
  isoWeekId,
  startOfISOWeek,
} from "@/lib/week";
import { useToday } from "@/components/use-today";
import { cn } from "@/lib/utils";

const statusLabel: Record<AttendanceStatus, string> = {
  present: "İştirak etdi",
  excused: "Üzürlü",
  unexcused: "Üzürsüz",
};

const statusDot: Record<AttendanceStatus, string> = {
  present: "bg-present",
  excused: "bg-excused",
  unexcused: "bg-absent",
};

export function WeekOverview() {
  const people = useAppStore((s) => s.people);
  const records = useAppStore((s) => s.records);
  const hydrated = useAppStore((s) => s.hasHydrated);
  const today = useToday();

  if (!hydrated || !today) return null;

  const weekId = isoWeekId(today);
  const monday = startOfISOWeek(today);

  return (
    <section className="rounded-xl border border-border bg-surface/80 p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-kicker text-accent uppercase">
            Bu həftə
          </p>
          <h2 className="mt-2 font-display text-2xl text-fg">Davamiyyət</h2>
        </div>
        <p className="text-sm text-muted">{formatFridayDate(weekId)}</p>
      </div>

      {people.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
          Hələ ad əlavə edilməyib. Bütün adlar burada görünəcək.
        </p>
      ) : (
        <>
          <div className="mb-4 hidden grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,1fr))] gap-2 text-xs tracking-wide text-subtle uppercase sm:grid">
            <span>Ad</span>
            {WEEKDAYS.map((d) => (
              <span key={d.day} className="text-center">
                {d.short}
              </span>
            ))}
          </div>

          <ul className="divide-y divide-border">
            {people.map((person) => (
              <li key={person.id} className="py-3 first:pt-0 last:pb-0">
                <div className="grid items-center gap-2 sm:grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,1fr))]">
                  <p className="break-words font-medium text-fg">{person.name}</p>
                  <div className="flex gap-2 sm:contents">
                    {WEEKDAYS.map((d) => {
                      const rec = findRecord(records, person.id, weekId, d.day);
                      const cellDate = addDays(monday, d.day);
                      const isToday =
                        cellDate.getFullYear() === today.getFullYear() &&
                        cellDate.getMonth() === today.getMonth() &&
                        cellDate.getDate() === today.getDate();
                      return (
                        <div
                          key={d.day}
                          className="flex flex-1 items-center justify-center gap-1.5"
                          title={
                            rec
                              ? `${d.full}: ${statusLabel[rec.status]}`
                              : `${d.full}: qeyd yoxdur`
                          }
                        >
                          <span
                            className={cn(
                              "size-2.5 rounded-full",
                              rec ? statusDot[rec.status] : "bg-border",
                              isToday && "ring-2 ring-accent/50 ring-offset-2 ring-offset-surface",
                            )}
                          />
                          <span className="text-xs text-subtle sm:hidden">{d.short}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted">
        <LegendDot className="bg-present" label="İştirak" />
        <LegendDot className="bg-excused" label="Üzürlü" />
        <LegendDot className="bg-absent" label="Üzürsüz" />
        <LegendDot className="bg-border" label="Qeyd yoxdur" />
      </div>
    </section>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("size-2 rounded-full", className)} />
      {label}
    </span>
  );
}