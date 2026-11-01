import { createFileRoute } from "@tanstack/react-router";
import { AbsenteeBoard } from "@/components/absentee-board";
import { HadithCard } from "@/components/hadith-card";
import { SiteHeader } from "@/components/site-header";
import { WeekOverview } from "@/components/week-overview";
import { StatsStrip } from "@/components/stats-strip";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 px-5 py-10 sm:gap-10 sm:py-16">
      <SiteHeader />
      <div className="rise rise-1"><HadithCard /></div>
      <div className="rise rise-2"><StatsStrip /></div>
      <div className="rise rise-3"><WeekOverview /></div>
      <div className="rise rise-4"><AbsenteeBoard /></div>
      <footer className="flex flex-col items-center gap-3 pb-8 pt-4 text-center">
        <div className="divider-ornament w-40 text-[10px]" aria-hidden="true">✦</div>
        <p className="text-[11px] tracking-kicker text-subtle uppercase">İctima · Cümə dəftəri</p>
      </footer>
    </main>
  );
}