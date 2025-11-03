import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function RegisterProfessional() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    professionalName: user?.name || "",
    specialty: "",
    registrationNumber: "",
    contactEmail: user?.email || "",
    contactPhone: "",
    bio: "",
  });

  const registerMutation = trpc.healthProfessional.register.useMutation({
    onSuccess: () => {
      toast.success("Cadastro realizado com sucesso! Aguardando aprovação.");
      setLocation('/professional/profile');
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao realizar cadastro");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.professionalName || !formData.specialty || !formData.registrationNumber || !formData.contactEmail) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    registerMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!user) {
    setLocation('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/select-user-type')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Cadastro de Profissional da Saúde</CardTitle>
            <CardDescription>
              Cadastre-se como profissional de saúde mental para ser listado na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="professionalName">Nome Completo *</Label>
                <Input
                  id="professionalName"
                  value={formData.professionalName}
                  onChange={(e) => handleChange('professionalName', e.target.value)}
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade *</Label>
                <Input
                  id="specialty"
                  value={formData.specialty}
                  onChange={(e) => handleChange('specialty', e.target.value)}
                  placeholder="Ex: Psicologia, Psiquiatria, Terapia Ocupacional"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Número de Registro Profissional *</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => handleChange('registrationNumber', e.target.value)}
                  placeholder="Ex: CRP 00/00000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">E-mail de Contato *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Telefone de Contato</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia / Apresentação</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Conte um pouco sobre sua experiência e abordagem profissional..."
                  rows={5}
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Cadastrando..." : "Enviar Cadastro"}
                </Button>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Seu cadastro será analisado por nossa equipe e você receberá uma notificação quando for aprovado.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
