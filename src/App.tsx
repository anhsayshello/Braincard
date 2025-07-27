import { useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import useRouteElements from "./useRouteElements";
import { localStorageEventTarget } from "./utils/auth";
import useReset from "./hooks/useReset";

export default function App() {
  const element = useRouteElements();
  const reset = useReset();

  useEffect(() => {
    localStorageEventTarget.addEventListener("clearLS", reset);
    return () => localStorageEventTarget.removeEventListener("clearLS", reset);
  }, [reset]);

  return (
    <>
      <Toaster position="top-center" />
      {element}
    </>
  );
}
