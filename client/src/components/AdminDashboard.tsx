import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, FileText, Settings, Calendar, Scissors, LogOut, Download, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

//todo: remove mock functionality - barbers list
const mockBarbers = [
  { id: 1, name: "Carlos Silva", email: "carlos@barbearia.com" },
  { id: 2, name: "João Santos", email: "joao@barbearia.com" },
];

//todo: remove mock functionality - services list
const mockServices = [
  { id: 1, name: "Corte de Cabelo", price: 50 },
  { id: 2, name: "Barba", price: 30 },
  { id: 3, name: "Corte + Barba", price: 70 },
];

//todo: remove mock functionality - revenue data
const mockRevenue = [
  { id: 1, barber: "Carlos Silva", client: "João Silva", service: "Corte + Barba", value: 70, date: "2024-01-15" },
  { id: 2, barber: "João Santos", client: "Pedro Costa", service: "Corte de Cabelo", value: 50, date: "2024-01-15" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("add-barber");
  const [shopName, setShopName] = useState("Barbearia Premium");
  const [address, setAddress] = useState("Rua dos Barbeiros, 123 - Centro - São Paulo, SP");
  const { toast } = useToast();

  const handleAddBarber = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Add barber");
    toast({ title: "Barbeiro adicionado com sucesso!" });
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Add service");
    toast({ title: "Serviço adicionado com sucesso!" });
  };

  const handleExportPDF = () => {
    console.log("Export PDF report");
    toast({ title: "Relatório em PDF gerado!", description: "Download iniciado..." });
  };

  const handleSaveSettings = () => {
    console.log("Save settings:", { shopName, address });
    toast({ title: "Configurações salvas!" });
  };

  const totalRevenue = mockRevenue.reduce((sum, item) => sum + item.value, 0);

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
              <h1 className="text-xl font-bold text-primary font-serif">Painel Administrativo</h1>
              <p className="text-sm text-muted-foreground">Gestão completa da barbearia</p>
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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="add-barber" data-testid="tab-add-barber">
              <UserPlus className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Barbeiros</span>
            </TabsTrigger>
            <TabsTrigger value="reports" data-testid="tab-reports">
              <FileText className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Relatórios</span>
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">
              <Settings className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Barbearia</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" data-testid="tab-schedule">
              <Calendar className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Horários</span>
            </TabsTrigger>
            <TabsTrigger value="services" data-testid="tab-services">
              <Scissors className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Serviços</span>
            </TabsTrigger>
          </TabsList>

          {/* Add Barber Tab */}
          <TabsContent value="add-barber" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Barbeiro</CardTitle>
                  <CardDescription>Crie uma nova conta para barbeiro</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddBarber} className="space-y-4">
                    <div>
                      <Label htmlFor="barber-name">Nome</Label>
                      <Input id="barber-name" placeholder="Nome completo" data-testid="input-barber-name" />
                    </div>
                    <div>
                      <Label htmlFor="barber-email">Email</Label>
                      <Input id="barber-email" type="email" placeholder="email@exemplo.com" data-testid="input-barber-email" />
                    </div>
                    <div>
                      <Label htmlFor="barber-password">Senha</Label>
                      <Input id="barber-password" type="password" placeholder="••••••••" data-testid="input-barber-password" />
                    </div>
                    <Button type="submit" className="w-full" data-testid="button-create-barber">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Criar Conta
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Barbeiros Cadastrados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockBarbers.map((barber) => (
                    <div key={barber.id} className="flex items-center justify-between p-3 bg-accent rounded-lg" data-testid={`barber-item-${barber.id}`}>
                      <div>
                        <p className="font-medium">{barber.name}</p>
                        <p className="text-sm text-muted-foreground">{barber.email}</p>
                      </div>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Relatório de Faturamento</CardTitle>
                    <CardDescription>Visualize todos os atendimentos confirmados</CardDescription>
                  </div>
                  <Button onClick={handleExportPDF} data-testid="button-export-pdf">
                    <Download className="w-4 h-4 mr-2" />
                    Extrair PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-6 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">Faturamento Total</p>
                  <p className="text-4xl font-bold text-primary">R$ {totalRevenue.toFixed(2)}</p>
                </div>
                <div className="space-y-3">
                  {mockRevenue.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`revenue-item-${item.id}`}>
                      <div>
                        <p className="font-medium">{item.client}</p>
                        <p className="text-sm text-muted-foreground">
                          Barbeiro: {item.barber} • {item.service}
                        </p>
                        <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <Badge variant="default" className="text-lg">R$ {item.value}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Configurar Barbearia</CardTitle>
                <CardDescription>Atualize as informações da barbearia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="shop-name">Nome da Barbearia</Label>
                  <Input
                    id="shop-name"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    data-testid="input-shop-name"
                  />
                </div>
                <div>
                  <Label htmlFor="logo">Logo da Barbearia</Label>
                  <Input id="logo" type="file" accept="image/*" data-testid="input-logo" />
                  <p className="text-xs text-muted-foreground mt-1">Será armazenado no Supabase Storage</p>
                </div>
                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    data-testid="input-address"
                  />
                </div>
                <Button onClick={handleSaveSettings} data-testid="button-save-settings">
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="mt-6">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Calendário de Funcionamento</CardTitle>
                <CardDescription>Configure os dias e horários de atendimento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((day, index) => (
                  <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-32">
                      <p className="font-medium">{day}</p>
                    </div>
                    <div className="flex-1 flex gap-4">
                      <div className="flex-1">
                        <Label htmlFor={`open-${index}`} className="text-xs">Abertura</Label>
                        <Input id={`open-${index}`} type="time" defaultValue="09:00" data-testid={`input-open-${index}`} />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`close-${index}`} className="text-xs">Fechamento</Label>
                        <Input id={`close-${index}`} type="time" defaultValue="21:00" data-testid={`input-close-${index}`} />
                      </div>
                    </div>
                  </div>
                ))}
                <Button data-testid="button-save-schedule">Salvar Horários</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Serviço</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddService} className="space-y-4">
                    <div>
                      <Label htmlFor="service-name">Nome do Serviço</Label>
                      <Input id="service-name" placeholder="Ex: Corte de Cabelo" data-testid="input-service-name" />
                    </div>
                    <div>
                      <Label htmlFor="service-price">Preço (R$)</Label>
                      <Input id="service-price" type="number" placeholder="50.00" data-testid="input-service-price" />
                    </div>
                    <Button type="submit" className="w-full" data-testid="button-add-service">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Serviço
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Serviços Disponíveis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-3 bg-accent rounded-lg" data-testid={`service-item-${service.id}`}>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-primary font-bold">R$ {service.price}</p>
                      </div>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
