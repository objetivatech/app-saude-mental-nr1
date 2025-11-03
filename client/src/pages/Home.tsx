import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Building2, Users, Stethoscope, ShieldCheck, Heart, Activity, Brain } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user type
      if (user.userType === 'company') {
        setLocation('/company/dashboard');
      } else if (user.userType === 'employee') {
        setLocation('/employee/dashboard');
      } else if (user.userType === 'health_professional') {
        setLocation('/professional/profile');
      } else if (user.role === 'admin') {
        setLocation('/admin/dashboard');
      } else {
        // User logged in but hasn't selected a type yet
        setLocation('/select-user-type');
      }
    }
  }, [isAuthenticated, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">{APP_TITLE}</h1>
              <p className="text-xs text-muted-foreground">Saúde Mental no Trabalho - NR1</p>
            </div>
          </div>
          {!isAuthenticated && (
            <Button asChild>
              <a href={getLoginUrl()}>Entrar</a>
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            <Brain className="w-4 h-4" />
            Alinhado à NR1
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Cuidando da Saúde Mental no Ambiente Corporativo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Plataforma completa para monitoramento e promoção do bem-estar psicológico dos colaboradores, 
            em conformidade com as normas regulamentadoras de segurança e saúde no trabalho.
          </p>
        </div>
      </section>

      {/* User Types Section */}
      <section className="container pb-24">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-12">Escolha seu perfil de acesso</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Company Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Empresa</CardTitle>
                <CardDescription>
                  Gerencie funcionários e visualize relatórios consolidados de bem-estar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <a href={getLoginUrl()}>Acessar como Empresa</a>
                </Button>
              </CardContent>
            </Card>

            {/* Employee Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Funcionário</CardTitle>
                <CardDescription>
                  Responda questionários semanais e acompanhe seu bem-estar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <a href={getLoginUrl()}>Acessar como Funcionário</a>
                </Button>
              </CardContent>
            </Card>

            {/* Health Professional Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Stethoscope className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Profissional</CardTitle>
                <CardDescription>
                  Cadastre-se como profissional da saúde mental
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <a href={getLoginUrl()}>Cadastrar-se</a>
                </Button>
              </CardContent>
            </Card>

            {/* Admin Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Administrador</CardTitle>
                <CardDescription>
                  Gerencie aprovações e conteúdos educativos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <a href={getLoginUrl()}>Acesso Admin</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-12">Recursos da Plataforma</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Activity className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-semibold">Monitoramento Contínuo</h4>
                <p className="text-sm text-muted-foreground">
                  Questionários semanais para acompanhamento do estado emocional dos colaboradores
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-semibold">Relatórios Analíticos</h4>
                <p className="text-sm text-muted-foreground">
                  Dashboards com métricas de bem-estar e indicadores de saúde mental
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-semibold">Suporte Profissional</h4>
                <p className="text-sm text-muted-foreground">
                  Acesso a profissionais qualificados em saúde mental
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2025 {APP_TITLE}. Todos os direitos reservados.</p>
          <p className="mt-2">Plataforma em conformidade com a NR1 - Norma Regulamentadora de Segurança e Saúde no Trabalho</p>
        </div>
      </footer>
    </div>
  );
}
