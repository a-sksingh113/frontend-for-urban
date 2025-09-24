/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

type GeoState = PermissionState | "unsupported";

export function useGeolocationPermission(opts?: {
  onGranted?: () => void;
  onDenied?: () => void;
}) {
  const { onGranted, onDenied } = opts ?? {};
  const [state, setState] = useState<GeoState>("prompt");
  const statusRef = useRef<PermissionStatus | null>(null);

  useEffect(() => {
    let disposed = false;

    async function init() {
      if (!("permissions" in navigator) || !("geolocation" in navigator)) {
        setState("unsupported");
        return;
      }

      try {
        // TS sometimes doesn’t include 'geolocation' in PermissionName union:
        const status = await (navigator as any).permissions.query({
          name: "geolocation",
        } as PermissionDescriptor);
        if (disposed) return;

        statusRef.current = status;
        setState(status.state);

        const onChange = () => {
          setState(status.state);
          if (status.state === "granted") onGranted?.();
          if (status.state === "denied") onDenied?.();
        };

        status.addEventListener("change", onChange);
        return () => status.removeEventListener("change", onChange);
      } catch {
        setState("unsupported");
      }
    }

    const cleanup = init();
    return () => {
      disposed = true;
      Promise.resolve(cleanup).catch(() => {});
    };
  }, [onGranted, onDenied]);

  return state;
}
