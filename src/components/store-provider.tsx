import { useEffect, type ReactNode } from "react";
import { migrateHadiths, SEED_HADITHS, useAppStore } from "@/lib/store";
import {
  ensureInitialMeclis,
  pullFromSupabase,
  pushPerson,
  deletePerson,
  pushHadith,
  deleteHadith,
  pushAttendance,
  seedHadithsIfEmpty,
} from "@/lib/supabase-sync";
import { testSupabaseConnection } from "@/lib/supabase-test";

export function StoreProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    let syncing = false;

    const finish = () => {
      const current = useAppStore.getState();
      const migrated = migrateHadiths(current.hadiths, current.hadithSeedVersion);
      useAppStore.setState({
        hadiths: migrated.hadiths,
        hadithSeedVersion: migrated.hadithSeedVersion,
      });
      if (!useAppStore.getState().hasHydrated) {
        useAppStore.getState().setHasHydrated(true);
      }
    };

    const result = useAppStore.persist.rehydrate();
    const afterHydrate = async () => {
      finish();
      syncing = true;
      useAppStore.setState({ syncStatus: "syncing" });
      try {
        const ok = await testSupabaseConnection();
        if (!ok) {
          useAppStore.setState({ syncStatus: "offline" });
          return;
        }
        await ensureInitialMeclis();
        await seedHadithsIfEmpty(SEED_HADITHS);
        let data = await pullFromSupabase();
        if (!data) {
          useAppStore.setState({ syncStatus: "offline" });
          return;
        }
        // One-time migration: local-only people/records -> Supabase.
        if (data.people.length === 0) {
          const local = useAppStore.getState();
          if (local.people.length > 0) {
            for (const p of local.people) await pushPerson(p);
            for (const r of local.records) await pushAttendance(r.personId, r.weekId, r.day, r.status);
            data = (await pullFromSupabase()) ?? data;
          }
        }
        useAppStore.setState({
          people: [...data.people].sort((a, b) => a.name.localeCompare(b.name, "az")),
          hadiths: data.hadiths.length > 0 ? data.hadiths : useAppStore.getState().hadiths,
          records: data.records,
          syncStatus: "online",
        });
      } finally {
        syncing = false;
      }
    };

    if (result && typeof result.then === "function") {
      void result.then(() => void afterHydrate());
    } else {
      void afterHydrate();
    }

    const timeout = window.setTimeout(() => {
      if (!useAppStore.getState().hasHydrated) {
        useAppStore.getState().setHasHydrated(true);
      }
    }, 80);

    const unsub = useAppStore.subscribe((state, prev) => {
      if (syncing) return;

      if (state.people.length > prev.people.length) {
        const added = state.people.find((p) => !prev.people.some((pp) => pp.id === p.id));
        if (added) {
          void pushPerson(added).then((res) => {
            if (res && res.remoteId !== added.id) {
              const current = useAppStore.getState();
              useAppStore.setState({
                people: current.people.map((p) =>
                  p.id === added.id ? { ...p, id: res.remoteId } : p
                ),
                records: current.records.map((r) =>
                  r.personId === added.id ? { ...r, personId: res.remoteId } : r
                ),
              });
            }
          });
        }
      }

      if (state.people.length < prev.people.length) {
        const removed = prev.people.find((p) => !state.people.some((pp) => pp.id === p.id));
        if (removed) void deletePerson(removed.id);
      }

      if (state.hadiths.length > prev.hadiths.length) {
        const added = state.hadiths.find((h) => !prev.hadiths.some((hh) => hh.id === h.id));
        if (added) {
          void pushHadith(added).then((res) => {
            if (res && res.remoteId !== added.id) {
              const current = useAppStore.getState();
              useAppStore.setState({
                hadiths: current.hadiths.map((h) =>
                  h.id === added.id ? { ...h, id: res.remoteId } : h
                ),
              });
            }
          });
        }
      }

      if (state.hadiths.length < prev.hadiths.length) {
        const removed = prev.hadiths.find((h) => !state.hadiths.some((hh) => hh.id === h.id));
        if (removed) void deleteHadith(removed.id);
      }

      if (state.records !== prev.records) {
        for (const r of state.records) {
          const old = prev.records.find(
            (p) => p.personId === r.personId && p.weekId === r.weekId && p.day === r.day
          );
          if (!old || old.status !== r.status) {
            void pushAttendance(r.personId, r.weekId, r.day, r.status);
          }
        }
        for (const old of prev.records) {
          const exists = state.records.some(
            (r) => r.personId === old.personId && r.weekId === old.weekId && r.day === old.day
          );
          if (!exists) {
            void pushAttendance(old.personId, old.weekId, old.day, null);
          }
        }
      }
    });

    return () => {
      window.clearTimeout(timeout);
      unsub();
    };
  }, []);

  return children;
}
