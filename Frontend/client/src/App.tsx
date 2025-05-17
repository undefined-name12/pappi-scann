import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import EnrichedPage from "@/pages/enriched";
import CrackedPage from "@/pages/cracked";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/enriched" component={EnrichedPage} />
      <Route path="/cracked" component={CrackedPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;