import { Calendar, Users, Shield, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import heroImage from "@assets/generated_images/Luxury_barbershop_hero_background_c30e776d.png";

export default function HeroSection() {
  const [, setLocation] = useLocation();

  const navigationButtons = [
    { icon: Calendar, label: "Agendar", path: "/agendar", testId: "button-agendar" },
    { icon: Users, label: "Eu sou barbeiro", path: "/barbeiro", testId: "button-barbeiro" },
    { icon: Shield, label: "Administrador", path: "/admin", testId: "button-admin" },
    { icon: Download, label: "Instale o APP", path: "/install", testId: "button-install" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 flex items-center justify-center" style={{ minHeight: '80vh' }}>
        {/* Background Image with Dark Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-primary rounded-lg flex items-center justify-center mb-4">
              <span className="text-4xl font-bold text-primary-foreground font-serif">B</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-serif text-primary" data-testid="text-title">
            Barbearia Premium
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-foreground/80">
            Estilo e elegância em cada corte
          </p>

          {/* Navigation Buttons Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {navigationButtons.map((btn) => {
              const Icon = btn.icon;
              return (
                <Button
                  key={btn.path}
                  size="lg"
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center gap-3 border-primary/50 bg-black/40 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                  onClick={() => setLocation(btn.path)}
                  data-testid={btn.testId}
                >
                  <Icon className="w-8 h-8" />
                  <span className="font-medium text-sm">{btn.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground" data-testid="text-address">
            📍 Rua dos Barbeiros, 123 - Centro - São Paulo, SP
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            © 2024 Barbearia Premium. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
