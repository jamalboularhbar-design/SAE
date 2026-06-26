import { Redirect } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import Home from "./Home";
import MarketingHomePage from "./MarketingHomePage";

/** Authenticated → app hub. Anonymous → public marketing homepage. */
export default function HomeGate() {
  const { isAuthenticated, loading } = useAuth({ redirectOnUnauthenticated: false });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <MarketingHomePage />;
  }

  return <Home />;
}
