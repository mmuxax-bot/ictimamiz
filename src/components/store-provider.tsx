import { useEffect, type ReactNode } from "react";
import { migrateHadiths, useAppStore } from "@/lib/store";

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
    if (result && typeof result.then === "function") {
      void result.then(finish);
    } else {
      finish();
    }

    const timeout = window.setTimeout(() => {
      if (!useAppStore.getState().hasHydrated) {
        useAppStore.getState().setHasHydrated(true);
      }
    }, 80);
    return () => window.clearTimeout(timeout);
  }, []);

  return children;
}
