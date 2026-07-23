import { useState, useCallback, useRef, useEffect } from "react";

type CameraState = "pending" | "granted" | "denied" | "blocked";

interface UseCameraPermissionReturn {
  state: CameraState;
  request: () => Promise<void>;
  revoke: () => void;
}

export function useCameraPermission(): UseCameraPermissionReturn {
  const [state, setState] = useState<CameraState>("pending");
  const streamRef = useRef<MediaStream | null>(null);
  const deniedCountRef = useRef(0);

  const revoke = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const request = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio : true
      });
      revoke();
      streamRef.current = stream;
      deniedCountRef.current = 0;
      setState("granted");
    } catch (err) {
      if (
        err instanceof DOMException &&
        (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")
      ) {
        deniedCountRef.current += 1;
        if (deniedCountRef.current >= 2) {
          setState("blocked");
        } else {
          setState("denied");
        }
      } else {
        setState("blocked");
      }
    }
  }, [revoke]);

  useEffect(() => {
    return () => revoke();
  }, [revoke]);

  return { state, request, revoke };
}