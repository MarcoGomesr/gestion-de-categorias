import { useEffect, useState } from "react";

/**
 * Returns true only on the client side, after hydration.
 * This is used to avoid hydration mismatches when rendering dynamic attributes
 * (e.g., from drag & drop libraries) that differ between SSR and client.
 */
function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
}

export default useIsClient;
