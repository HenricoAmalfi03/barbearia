import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, User, LogOut, Check, X, MessageCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

//todo: remove mock functionality - appointments data
const mockAppointments = [
  { id: 1, clientName: "João Silva", whatsapp: "(11) 98765-4321", service: "Corte + Barba", date: "2024-01-15", time: "10:00", status: "pending" },
  { id: 2, clientName: "Carlos Santos", whatsapp: "(11) 97654-3210", service: "Corte de Cabelo", date: "2024-01-15", time: "11:00", status: "pending" },
  { id: 3, clientName: "Pedro Costa", whatsapp: "(11) 96543-2109", service: "Barba", date: "2024-01-15", time: "14:00", status: "pending" },
];

export default function BarberDashboard() {
  const [activeTab, setActiveTab] = useState("appointments");
  const [name, setName] = useState("Carlos Silva");
  const [photo, setPhoto] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAttended = (id: number) => {
    console.log("Mark as attended:", id);
    toast({ title: "Cliente marcado como compareceu" });
  };

  const handleNotAttended = (id: number) => {
    console.log("Mark as not attended:", id);
    toast({ title: "Cliente marcado como não compareceu" });
  };

  const handleSendMessage = (whatsapp: string, clientName: string) => {
    const cleanNumber = whatsapp.replace(/\D/g, "");
    const message = encodeURIComponent(`Olá ${clientName}, tudo bem? Confirmando seu agendamento na barbearia!`);
    window.open(`https://wa.me/55${cleanNumber}?text=${message}`, "_blank");
  };

  const handleCancel = (id: number) => {
    console.log("Cancel appointment:", id);
    toast({ title: "Agendamento cancelado", variant: "destructive" });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Arquivo muito grande", description: "Máximo 5MB", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
      toast({ title: "Foto atualizada com sucesso!" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground font-serif">B</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary font-serif">Portal do Barbeiro</h1>
              <p className="text-sm text-muted-foreground">{name}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" data-testid="button-logout">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="appointments" data-testid="tab-appointments">
              <Calendar className="w-4 h-4 mr-2" />
              Agendamentos
            </TabsTrigger>
            <TabsTrigger value="profile" data-testid="tab-profile">
              <User className="w-4 h-4 mr-2" />
              Perfil
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="mt-6">
            <div className="space-y-4">
              {mockAppointments.map((appointment) => (
                <Card key={appointment.id} data-testid={`card-appointment-${appointment.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{appointment.clientName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{appointment.whatsapp}</p>
                      </div>
                      <Badge variant="outline">{appointment.service}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm">
                        <p className="text-muted-foreground">
                          📅 {new Date(appointment.date).toLocaleDateString("pt-BR")} às {appointment.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleAttended(appointment.id)}
                        data-testid={`button-attended-${appointment.id}`}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Compareceu
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleNotAttended(appointment.id)}
                        data-testid={`button-not-attended-${appointment.id}`}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Não Compareceu
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendMessage(appointment.whatsapp, appointment.clientName)}
                        data-testid={`button-message-${appointment.id}`}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Enviar Mensagem
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancel(appointment.id)}
                        data-testid={`button-cancel-${appointment.id}`}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Configurar Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-32 h-32">
                    {photo ? (
                      <AvatarImage src={photo} alt={name} />
                    ) : (
                      <AvatarFallback className="text-4xl">{name[0]}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <Label htmlFor="photo" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>Alterar Foto</span>
                      </Button>
                    </Label>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                      data-testid="input-photo"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Máximo 5MB</p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-testid="input-name"
                  />
                </div>
                <Button data-testid="button-save-profile">Salvar Alterações</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
