import { createFileRoute } from "@tanstack/react-router";
import { AbsenteeBoard } from "@/components/absentee-board";
import { HadithCard } from "@/components/hadith-card";
import { SiteHeader } from "@/components/site-header";
import { WeekOverview } from "@/components/week-overview";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:gap-10 sm:py-16">
      <SiteHeader />
      <HadithCard />
      <WeekOverview />
      <AbsenteeBoard />
      <footer className="pb-8 pt-4 text-center text-xs tracking-kicker text-subtle uppercase">
        İctima
      </footer>
    </main>
  );
}