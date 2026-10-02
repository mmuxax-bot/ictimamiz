import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, LogOut, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusPicker } from "@/components/status-picker";
import { useToday } from "@/components/use-today";
import {
  ADMIN_SESSION_KEY,
  findRecord,
  useAppStore,
  type AttendanceStatus,
} from "@/lib/store";
import {
  WEEKDAYS,
  canEditDay,
  editBlockReason,
  formatDayMonth,
  formatFridayDate,
  isFriday,
  isoWeekId,
  mondayFromWeekId,
  addDays,
  shiftWeekId,
  isPastOrToday,
} from "@/lib/week";
import { cn } from "@/lib/utils";

type Tab = "defter" | "hadis";

export function AdminPanel({ onLock }: { onLock: () => void }) {
  const [tab, setTab] = useState<Tab>("defter");

  function lock() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    onLock();
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:py-12">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-kicker text-accent uppercase">
            Gizli panel
          </p>
          <h1 className="mt-2 font-display text-4xl text-fg">Admin</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={lock} aria-label="Çıxış">
          <LogOut className="size-4" />
        </Button>
      </header>

      <div className="flex gap-1 rounded-lg bg-surface p-1 border border-border">
        <TabButton active={tab === "defter"} onClick={() => setTab("defter")}>
          Dəftər
        </TabButton>
        <TabButton active={tab === "hadis"} onClick={() => setTab("hadis")}>
          Hədislər
        </TabButton>
      </div>

      {tab === "defter" ? <LedgerTab /> : <HadithTab />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-11 flex-1 rounded-md text-sm font-medium transition-colors duration-150",
        active ? "bg-elevated text-fg" : "text-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

function LedgerTab() {
  const people = useAppStore((s) => s.people);
  const records = useAppStore((s) => s.records);
  const addPerson = useAppStore((s) => s.addPerson);
  const removePerson = useAppStore((s) => s.removePerson);
  const setAttendance = useAppStore((s) => s.setAttendance);
  const today = useToday();
  const [name, setName] = useState("");
  const [weekId, setWeekId] = useState(() => isoWeekId(new Date()));
  const [day, setDay] = useState(() => {
    const d = new Date().getDay();
    if (d >= 1 && d <= 5) return d - 1;
    return 4;
  });
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const currentWeek = today ? isoWeekId(today) : weekId;
  const friday = today ? isFriday(today) : false;
  const editable = today ? canEditDay(today, weekId, day) : false;
  const dayMeta = WEEKDAYS[day] ?? WEEKDAYS[4];
  const dayDate = useMemo(
    () => addDays(mondayFromWeekId(weekId), day),
    [weekId, day],
  );

  function onAdd(e: FormEvent) {
    e.preventDefault();
    const result = addPerson(name);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setName("");
    toast.success("Ad əlavə olundu.");
  }

  function onStatus(personId: string, status: AttendanceStatus | null) {
    if (!today) return;
    const blocked = editBlockReason(today, weekId, day);
    if (blocked) {
      toast.error(blocked);
      return;
    }
    setAttendance(personId, weekId, day, status);
  }

  function onDeletePerson(id: string) {
    if (pendingDelete !== id) {
      setPendingDelete(id);
      window.setTimeout(() => setPendingDelete((cur) => (cur === id ? null : cur)), 3500);
      return;
    }
    removePerson(id);
    setPendingDelete(null);
    toast.success("Ad silindi.");
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onAdd} className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ad və soyad"
          aria-label="Yeni ad"
        />
        <Button type="submit" className="sm:w-40">
          <Plus className="size-4" />
          Əlavə et
        </Button>
      </form>

      <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Əvvəlki həftə"
            onClick={() => setWeekId((w) => shiftWeekId(w, -1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <div className="text-center">
            <p className="font-medium text-fg">{formatFridayDate(weekId)}</p>
            {weekId === currentWeek ? (
              <p className="text-xs text-accent">Cari həftə</p>
            ) : (
              <button
                type="button"
                className="text-xs text-muted hover:text-fg"
                onClick={() => setWeekId(currentWeek)}
              >
                Cari həftəyə qayıt
              </button>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Növbəti həftə"
            onClick={() => setWeekId((w) => shiftWeekId(w, 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {weekId > currentWeek ? (
          <p className="mt-4 rounded-md border border-border bg-elevated px-3 py-3 text-sm text-muted">
            Gələcək həftə — yalnız baxış üçündür.
          </p>
        ) : weekId < currentWeek ? (
          <p className="mt-4 rounded-md border border-accent/25 bg-accent/10 px-3 py-3 text-sm text-fg">
            Keçmiş həftə — bütün günlər üçün qayıb qoymaq və silmək olar.
          </p>
        ) : !friday ? (
          <p className="mt-4 rounded-md border border-border bg-elevated px-3 py-3 text-sm text-muted">
            Cari həftəyə qayıb yalnız cümə günü qoyula bilər. Keçmiş həftələrə keçib
            qayıb yazmaq olar.
          </p>
        ) : (
          <p className="mt-4 rounded-md border border-accent/25 bg-accent/10 px-3 py-3 text-sm text-fg">
            Cümə günüdür — bu həftənin keçmiş günləri və bu gün üçün qayıb qoymaq
            olar.
          </p>
        )}

        <div className="mt-4 grid grid-cols-5 gap-1">
          {WEEKDAYS.map((d) => {
            const past = today ? isPastOrToday(today, weekId, d.day) : false;
            return (
              <button
                key={d.day}
                type="button"
                onClick={() => setDay(d.day)}
                className={cn(
                  "min-h-11 rounded-md px-1 py-2 text-center transition-colors duration-150",
                  day === d.day ? "bg-elevated text-fg" : "text-muted hover:text-fg",
                )}
              >
                <span className="block text-xs font-medium">{d.short}</span>
                {!past ? <span className="mt-1 block text-xs text-subtle">gələcək</span> : null}
              </button>
            );
          })}
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-display text-2xl text-fg">{dayMeta.full}</h2>
          <p className="text-sm text-muted">{formatDayMonth(dayDate)}</p>
        </div>

        {people.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
            Siyahı boşdur. Yuxarıdan ad əlavə edin.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {people.map((person) => {
              const rec = findRecord(records, person.id, weekId, day);
              return (
                <li
                  key={person.id}
                  className="rounded-xl border border-border bg-surface p-4"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <p className="font-medium text-fg">{person.name}</p>
                    <Button
                      type="button"
                      variant={pendingDelete === person.id ? "danger" : "ghost"}
                      size="icon"
                      className="size-11 shrink-0"
                      aria-label={
                        pendingDelete === person.id
                          ? `${person.name} silinsin?`
                          : `${person.name} sil`
                      }
                      onClick={() => onDeletePerson(person.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <StatusPicker
                    value={rec?.status ?? null}
                    disabled={!editable}
                    onChange={(status) => onStatus(person.id, status)}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function HadithTab() {
  const hadiths = useAppStore((s) => s.hadiths);
  const addHadith = useAppStore((s) => s.addHadith);
  const removeHadith = useAppStore((s) => s.removeHadith);
  const [text, setText] = useState("");
  const [source, setSource] = useState("");

  function onAdd(e: FormEvent) {
    e.preventDefault();
    const result = addHadith(text, source);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setText("");
    setSource("");
    toast.success("Hədis əlavə olundu.");
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onAdd} className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:p-5">
        <label className="text-sm font-medium text-fg" htmlFor="hadith-text">
          Yeni hədis
        </label>
        <Textarea
          id="hadith-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="نص الحديث"
          dir="rtl"
          lang="ar"
          className="font-arabic text-lg leading-loose"
        />
        <Input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="المصدر (صحيح البخاري)"
          aria-label="Mənbə"
          dir="rtl"
          lang="ar"
          className="font-arabic"
        />
        <Button type="submit" className="self-start">
          <Plus className="size-4" />
          Əlavə et
        </Button>
      </form>

      {hadiths.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
          Hədis yoxdur. Ana səhifədəki kart buradan doldurulur.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {hadiths.map((h) => (
            <li
              key={h.id}
              className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4"
            >
              <div className="min-w-0 flex-1" dir="rtl" lang="ar">
                <p className="font-arabic text-lg leading-loose text-fg">{h.text}</p>
                <p className="mt-2 font-arabic text-sm tracking-wide text-muted">{h.source}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Hədisi sil"
                onClick={() => {
                  removeHadith(h.id);
                  toast.success("Hədis silindi.");
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
