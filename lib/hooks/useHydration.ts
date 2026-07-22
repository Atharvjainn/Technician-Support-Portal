"use client";

import { useSyncExternalStore, useCallback } from "react";

interface PersistApi {
  hasHydrated: () => boolean;
  onFinishHydration: (callback: () => void) => () => void;
}

export function useHydration(persistApi: PersistApi) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const unsub = persistApi.onFinishHydration(onStoreChange);
      if (persistApi.hasHydrated()) onStoreChange();
      return unsub;
    },
    [persistApi]
  );

  const getSnapshot = useCallback(() => persistApi.hasHydrated(), [persistApi]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}