// de-pee/src/hooks/use-mobile.ts
import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  return React.useSyncExternalStore(
    // 1. Subscribe to window resize changes
    (callback) => {
      if (typeof window === 'undefined') return () => {};
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    // 2. Client-side snapshot reader
    () => window.innerWidth < MOBILE_BREAKPOINT,
    // 3. Server-side default value (Next.js SSR fallback)
    () => false,
  );
}
