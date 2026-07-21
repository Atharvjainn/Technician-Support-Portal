"use client";

import { useEffect, useState } from "react";
import { useMissionStore } from "../store/job-config.store";

export function useMissionHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(useMissionStore.persist.hasHydrated());  
    //dont render it outside as due to ssr it will be undefined and will cause hydration errors.

    const unsub = useMissionStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    return unsub;
  }, []);

  return hydrated;
}