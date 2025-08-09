import { Toaster } from "./components/ui/sonner";
import useRouteElements from "./useRouteElements";

export default function App() {
  const element = useRouteElements();

  return (
    <>
      <Toaster position="top-center" />
      {element}
    </>
  );
}
