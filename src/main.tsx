import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();

if (process.env.NODE_ENV === "production") {
  console.log = () => {};
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <GoogleOAuthProvider clientId={`${import.meta.env.VITE_CLIENT_ID}`}>
            <App />
          </GoogleOAuthProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
