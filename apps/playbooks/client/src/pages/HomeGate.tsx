import { Redirect } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import Home from "./Home";

/** Authenticated app hub at `/`. Anonymous visitors go to public marketing at `/product`. */
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
    return <Redirect to="/product" />;
  }

  return <Home />;
}
