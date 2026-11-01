import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function HadithCard() {
  const hadiths = useAppStore((s) => s.hadiths);
  const hydrated = useAppStore((s) => s.hasHydrated);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (index >= hadiths.length) setIndex(0);
  }, [hadiths.length, index]);

  useEffect(() => {
    if (hadiths.length < 2) return;
    const swap = () => {
      if (reduceMotion) {
        setIndex((i) => (i + 1) % hadiths.length);
        return;
      }
      setPhase("out");
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % hadiths.length);
        setPhase("in");
      }, 250);
    };
    const id = window.setInterval(swap, 14000);
    return () => window.clearInterval(id);
  }, [hadiths.length, reduceMotion]);

  const current = hadiths[index];

  return (
    <section aria-label="Hədis" className="hadith-shell">
      <span className="hadith-light" aria-hidden="true" />
      <span className="hadith-light-trail" aria-hidden="true" />
      <div className="hadith-shell-inner px-6 py-9 sm:px-12 sm:py-12">
        <div className="mb-7 flex items-center justify-between">
          <p className="text-xs font-semibold tracking-kicker text-accent uppercase">Həftənin hədisi</p>
          {hadiths.length > 0 ? (
            <p className="text-xs text-subtle tabular-nums">{index + 1} / {hadiths.length}</p>
          ) : null}
        </div>
        {!hydrated ? (
          <div className="space-y-3" dir="rtl">
            <div className="h-6 w-5/6 skeleton" />
            <div className="h-6 w-3/4 skeleton" />
            <div className="h-4 w-1/3 skeleton" />
          </div>
        ) : current ? (
          <div className="hadith-copy min-h-40" data-state={phase} dir="rtl" lang="ar">
            <blockquote className="font-arabic text-2xl leading-[2] text-fg sm:text-[1.75rem]">
              {current.text}
            </blockquote>
            <p className="mt-7 border-t border-border/60 pt-4 font-arabic text-sm tracking-wide text-accent/80">
              {current.source}
            </p>
          </div>
        ) : (
          <p className="min-h-40 font-display text-2xl leading-snug text-muted italic">
            Hələ hədis əlavə edilməyib.
          </p>
        )}
        {hadiths.length > 1 ? (
          <div className="mt-8 flex items-center gap-2" role="tablist" aria-label="Hədislər">
            {hadiths.map((h, i) => (
              <button
                key={h.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Hədis ${i + 1}`}
                onClick={() => {
                  setPhase("in");
                  setIndex(i);
                }}
                className={cn(
                  "h-2 rounded-full transition-[width,background-color] duration-200",
                  i === index ? "w-6 bg-accent" : "w-2 bg-border hover:bg-muted",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
