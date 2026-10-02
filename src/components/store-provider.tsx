import { useEffect, type ReactNode } from "react";
import { migrateHadiths, useAppStore } from "@/lib/store";
import {
  ensureInitialMeclis,
  pullFromSupabase,
  pushPerson,
  deletePerson,
  pushHadith,
  deleteHadith,
} from "@/lib/supabase-sync";

export function StoreProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const finish = () => {
      const current = useAppStore.getState();
      const migrated = migrateHadiths(
        current.hadiths,
        current.hadithSeedVersion,
      );
      useAppStore.setState({
        hadiths: migrated.hadiths,
        hadithSeedVersion: migrated.hadithSeedVersion,
      });
      if (!useAppStore.getState().hasHydrated) {
        useAppStore.getState().setHasHydrated(true);
      }
    };

    const result = useAppStore.persist.rehydrate();
    const afterHydrate = () => {
      finish();
      // Supabase-den oxu
      void ensureInitialMeclis().then(() =>
        pullFromSupabase().then((data) => {
          if (data && (data.people.length > 0 || data.hadiths.length > 0)) {
            useAppStore.setState({
              people: data.people.length > 0 ? data.people : useAppStore.getState().people,
              hadiths: data.hadiths.length > 0 ? data.hadiths : useAppStore.getState().hadiths,
            });
          }
        }),
      );
    };

    if (result && typeof result.then === "function") {
      void result.then(afterHydrate);
    } else {
      afterHydrate();
    }

    const timeout = window.setTimeout(() => {
      if (!useAppStore.getState().hasHydrated) {
        useAppStore.getState().setHasHydrated(true);
      }
    }, 80);

    // Store deyishdikde Supabase-e yaz
    const unsub = useAppStore.subscribe((state, prev) => {
      // Yeni shexs
      if (state.people.length > prev.people.length) {
        const added = state.people.find((p) => !prev.people.some((pp) => pp.id === p.id));
        if (added) void pushPerson(added);
      }
      // Shexs silindi
      if (state.people.length < prev.people.length) {
        const removed = prev.people.find((p) => !state.people.some((pp) => pp.id === p.id));
        if (removed) void deletePerson(removed.id);
      }
      // Yeni hedis
      if (state.hadiths.length > prev.hadiths.length) {
        const added = state.hadiths.find((h) => !prev.hadiths.some((hh) => hh.id === h.id));
        if (added) void pushHadith(added);
      }
      // Hedis silindi
      if (state.hadiths.length < prev.hadiths.length) {
        const removed = prev.hadiths.find((h) => !state.hadiths.some((hh) => hh.id === h.id));
        if (removed) void deleteHadith(removed.id);
      }
    });

    return () => {
      window.clearTimeout(timeout);
      unsub();
    };
  }, []);

  return children;
}
