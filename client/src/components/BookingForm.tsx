import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import barber1 from "@assets/generated_images/Male_barber_professional_headshot_d1f951a5.png";
import barber2 from "@assets/generated_images/Bearded_barber_professional_photo_669655ae.png";
import barber3 from "@assets/generated_images/Young_barber_professional_portrait_2b528166.png";

//todo: remove mock functionality - barbers data
const mockBarbers = [
  { id: 1, name: "Carlos Silva", image: barber1 },
  { id: 2, name: "João Santos", image: barber2 },
  { id: 3, name: "Pedro Costa", image: barber3 },
];

//todo: remove mock functionality - services data
const mockServices = [
  { id: 1, name: "Corte de Cabelo", price: 50 },
  { id: 2, name: "Barba", price: 30 },
  { id: 3, name: "Corte + Barba", price: 70 },
  { id: 4, name: "Pigmentação", price: 40 },
];

//todo: remove mock functionality - time slots
const mockTimeSlots = [
  "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

type BookingData = {
  clientName: string;
  whatsapp: string;
  barberId: number | null;
  serviceId: number | null;
  date: Date | undefined;
  time: string | null;
};

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    clientName: "",
    whatsapp: "",
    barberId: null,
    serviceId: null,
    date: undefined,
    time: null,
  });
  const { toast } = useToast();

  const handleNext = () => {
    if (step === 1 && (!bookingData.clientName || !bookingData.whatsapp)) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    if (step === 2 && !bookingData.barberId) {
      toast({ title: "Selecione um barbeiro", variant: "destructive" });
      return;
    }
    if (step === 3 && !bookingData.serviceId) {
      toast({ title: "Selecione um serviço", variant: "destructive" });
      return;
    }
    if (step === 4 && (!bookingData.date || !bookingData.time)) {
      toast({ title: "Selecione data e horário", variant: "destructive" });
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = () => {
    console.log("Booking submitted:", bookingData);
    toast({ title: "Agendamento realizado com sucesso!", description: "Você receberá uma confirmação no WhatsApp." });
  };

  const selectedBarber = mockBarbers.find(b => b.id === bookingData.barberId);
  const selectedService = mockServices.find(s => s.id === bookingData.serviceId);

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 w-16 rounded-full transition-all ${
                s === step ? "bg-primary" : s < step ? "bg-primary/50" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-primary">
              {step === 1 && "Suas Informações"}
              {step === 2 && "Escolha seu Barbeiro"}
              {step === 3 && "Selecione o Serviço"}
              {step === 4 && "Data e Horário"}
              {step === 5 && "Confirmação"}
            </CardTitle>
            <CardDescription>
              Passo {step} de 5
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Client Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientName">Nome Completo</Label>
                  <Input
                    id="clientName"
                    placeholder="Digite seu nome"
                    value={bookingData.clientName}
                    onChange={(e) => setBookingData({ ...bookingData, clientName: e.target.value })}
                    data-testid="input-client-name"
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    placeholder="(11) 99999-9999"
                    value={bookingData.whatsapp}
                    onChange={(e) => setBookingData({ ...bookingData, whatsapp: e.target.value })}
                    data-testid="input-whatsapp"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Barber Selection */}
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockBarbers.map((barber) => (
                  <Card
                    key={barber.id}
                    className={`cursor-pointer transition-all hover-elevate ${
                      bookingData.barberId === barber.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setBookingData({ ...bookingData, barberId: barber.id })}
                    data-testid={`card-barber-${barber.id}`}
                  >
                    <CardContent className="p-6 text-center">
                      <Avatar className="w-24 h-24 mx-auto mb-4">
                        <AvatarImage src={barber.image} alt={barber.name} />
                        <AvatarFallback>{barber.name[0]}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold">{barber.name}</h3>
                      {bookingData.barberId === barber.id && (
                        <Badge variant="default" className="mt-2">
                          <Check className="w-3 h-3 mr-1" />
                          Selecionado
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Step 3: Service Selection */}
            {step === 3 && (
              <div className="space-y-3">
                {mockServices.map((service) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all hover-elevate ${
                      bookingData.serviceId === service.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setBookingData({ ...bookingData, serviceId: service.id })}
                    data-testid={`card-service-${service.id}`}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {bookingData.serviceId === service.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <span className="text-primary font-bold">R$ {service.price}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Step 4: Date & Time */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="mb-4 block">Selecione a Data</Label>
                  <Calendar
                    mode="single"
                    selected={bookingData.date}
                    onSelect={(date) => setBookingData({ ...bookingData, date })}
                    className="rounded-md border mx-auto"
                    disabled={(date) => date < new Date()}
                  />
                </div>
                {bookingData.date && (
                  <div>
                    <Label className="mb-4 block">Selecione o Horário</Label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {mockTimeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={bookingData.time === time ? "default" : "outline"}
                          onClick={() => setBookingData({ ...bookingData, time })}
                          data-testid={`button-time-${time}`}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Confirmation */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="p-4 bg-accent rounded-lg space-y-2">
                  <p><strong>Nome:</strong> {bookingData.clientName}</p>
                  <p><strong>WhatsApp:</strong> {bookingData.whatsapp}</p>
                  <p><strong>Barbeiro:</strong> {selectedBarber?.name}</p>
                  <p><strong>Serviço:</strong> {selectedService?.name}</p>
                  <p><strong>Data:</strong> {bookingData.date?.toLocaleDateString("pt-BR")}</p>
                  <p><strong>Horário:</strong> {bookingData.time}</p>
                  <p className="text-xl font-bold text-primary pt-2">
                    Total: R$ {selectedService?.price}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  data-testid="button-back"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              )}
              <div className="ml-auto">
                {step < 5 ? (
                  <Button onClick={handleNext} data-testid="button-next">
                    Próximo
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} data-testid="button-confirm">
                    Confirmar Agendamento
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
