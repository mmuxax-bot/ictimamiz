import { formatFridayDate, isoWeekId } from "@/lib/week";
import { useToday } from "@/components/use-today";

export function SiteHeader() {
  const today = useToday();
  const weekLabel = today ? formatFridayDate(isoWeekId(today)) : " ";

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="star-mark" aria-hidden="true" />
        <div>
          <p className="text-xs font-medium tracking-kicker text-accent uppercase">
            Həftəlik qayıb dəftəri
          </p>
          <h1 className="font-display text-4xl leading-tight tracking-tight text-fg sm:text-5xl">
            İctima
          </h1>
        </div>
      </div>
      <p className="text-sm text-muted">{weekLabel}</p>
    </header>
  );
}