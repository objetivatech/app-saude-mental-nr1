import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function RegisterCompany() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    companyName: "",
    cnpj: "",
    contactEmail: user?.email || "",
    contactPhone: "",
  });

  const registerMutation = trpc.company.register.useMutation({
    onSuccess: () => {
      toast.success("Empresa cadastrada com sucesso! Aguardando aprovação.");
      setLocation('/company/dashboard');
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao cadastrar empresa");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.cnpj || !formData.contactEmail) {
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
            <CardTitle>Cadastro de Empresa</CardTitle>
            <CardDescription>
              Preencha os dados da sua empresa para começar a utilizar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="Digite o nome da empresa"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleChange('cnpj', e.target.value)}
                  placeholder="00.000.000/0000-00"
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
                  placeholder="contato@empresa.com"
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

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Cadastrando..." : "Cadastrar Empresa"}
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
