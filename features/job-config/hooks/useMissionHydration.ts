"use client";

import { useSyncExternalStore, useCallback } from "react";
import { useMissionStore } from "../store/job-config.store";

export function useMissionHydration() {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const unsub = useMissionStore.persist.onFinishHydration(() => {
        onStoreChange();
      });

      if (useMissionStore.persist.hasHydrated()) {
        onStoreChange();
      }

      return unsub;
    },
    []
  );

  const getSnapshot = useCallback(
    () => useMissionStore.persist.hasHydrated(),
    []
  );

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
