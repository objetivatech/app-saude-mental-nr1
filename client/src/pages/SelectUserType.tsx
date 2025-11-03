import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Stethoscope } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function SelectUserType() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    setLocation('/');
    return null;
  }

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    
    // Redirect to registration page based on type
    if (type === 'company') {
      setLocation('/company/register');
    } else if (type === 'employee') {
      setLocation('/employee/register');
    } else if (type === 'health_professional') {
      setLocation('/professional/register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Bem-vindo(a), {user.name}!</h1>
          <p className="text-muted-foreground">Selecione o tipo de perfil que deseja criar</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Company Card */}
          <Card 
            className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary"
            onClick={() => handleSelectType('company')}
          >
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-center">Empresa</CardTitle>
              <CardDescription className="text-center">
                Cadastre sua empresa e gerencie funcionários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Cadastrar Empresa</Button>
            </CardContent>
          </Card>

          {/* Employee Card */}
          <Card 
            className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary"
            onClick={() => handleSelectType('employee')}
          >
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-center">Funcionário</CardTitle>
              <CardDescription className="text-center">
                Vincule-se a uma empresa e responda questionários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Cadastrar como Funcionário</Button>
            </CardContent>
          </Card>

          {/* Health Professional Card */}
          <Card 
            className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary"
            onClick={() => handleSelectType('health_professional')}
          >
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Stethoscope className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-center">Profissional</CardTitle>
              <CardDescription className="text-center">
                Cadastre-se como profissional da saúde mental
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Cadastrar Profissional</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
