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

export default function RegisterEmployee() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    companyId: "",
    employeeName: user?.name || "",
    employeeEmail: user?.email || "",
    department: "",
    position: "",
  });

  const registerMutation = trpc.employee.register.useMutation({
    onSuccess: () => {
      toast.success("Cadastro realizado com sucesso!");
      setLocation('/employee/dashboard');
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao realizar cadastro");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyId || !formData.employeeName || !formData.employeeEmail) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    registerMutation.mutate({
      ...formData,
      companyId: parseInt(formData.companyId),
    });
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
            <CardTitle>Cadastro de Funcionário</CardTitle>
            <CardDescription>
              Vincule-se a uma empresa para começar a responder os questionários de bem-estar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyId">ID da Empresa *</Label>
                <Input
                  id="companyId"
                  type="number"
                  value={formData.companyId}
                  onChange={(e) => handleChange('companyId', e.target.value)}
                  placeholder="Digite o ID da empresa fornecido pelo RH"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Solicite o ID da empresa ao departamento de Recursos Humanos
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeName">Nome Completo *</Label>
                <Input
                  id="employeeName"
                  value={formData.employeeName}
                  onChange={(e) => handleChange('employeeName', e.target.value)}
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeEmail">E-mail Corporativo *</Label>
                <Input
                  id="employeeEmail"
                  type="email"
                  value={formData.employeeEmail}
                  onChange={(e) => handleChange('employeeEmail', e.target.value)}
                  placeholder="seu.email@empresa.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  placeholder="Ex: TI, RH, Financeiro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Cargo</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  placeholder="Ex: Analista, Gerente, Coordenador"
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Cadastrando..." : "Completar Cadastro"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
