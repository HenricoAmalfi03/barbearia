import { useState } from "react";
import BarberLogin from "@/components/BarberLogin";
import BarberDashboard from "@/components/BarberDashboard";

export default function Barber() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <BarberLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return <BarberDashboard />;
}
