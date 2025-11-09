import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Monitor, Share } from "lucide-react";

export default function InstallPrompt() {
  const handleInstall = () => {
    console.log("Install PWA triggered");
    // PWA install logic will be added in backend phase
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <Card className="max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-primary rounded-lg flex items-center justify-center mb-4">
            <Download className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-serif text-primary">Instale o App</CardTitle>
          <CardDescription>
            Tenha acesso rápido à barbearia direto do seu dispositivo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-accent rounded-lg">
              <Smartphone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">No celular</h3>
                <p className="text-sm text-muted-foreground">
                  Toque no botão de compartilhar <Share className="w-4 h-4 inline" /> e selecione "Adicionar à Tela Inicial"
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-accent rounded-lg">
              <Monitor className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">No computador</h3>
                <p className="text-sm text-muted-foreground">
                  Clique no ícone de instalação na barra de endereço ou use o botão abaixo
                </p>
              </div>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={handleInstall} data-testid="button-install-pwa">
            <Download className="w-5 h-5 mr-2" />
            Instalar Aplicativo
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              O app funciona offline e ocupa pouco espaço no seu dispositivo
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
