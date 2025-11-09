import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Booking from "@/pages/Booking";
import Barber from "@/pages/Barber";
import Admin from "@/pages/Admin";
import Install from "@/pages/Install";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/agendar" component={Booking} />
      <Route path="/barbeiro" component={Barber} />
      <Route path="/admin" component={Admin} />
      <Route path="/install" component={Install} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
