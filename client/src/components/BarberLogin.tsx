import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";

type BarberLoginProps = {
  onLogin: () => void;
};

export default function BarberLogin({ onLogin }: BarberLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    console.log("Barber login:", { email, password });
    toast({ title: "Login realizado com sucesso!" });
    onLogin();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-primary rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-primary-foreground font-serif">B</span>
          </div>
          <CardTitle className="text-2xl font-serif text-primary">Portal do Barbeiro</CardTitle>
          <CardDescription>Entre com suas credenciais</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-barber-email"
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-barber-password"
              />
            </div>
            <Button type="submit" className="w-full" data-testid="button-barber-login">
              <LogIn className="w-4 h-4 mr-2" />
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
