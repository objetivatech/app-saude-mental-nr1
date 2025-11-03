import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Users, TrendingUp, Activity, AlertCircle, Brain, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CompanyDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: company, isLoading: companyLoading, error } = trpc.company.getMyCompany.useQuery(undefined, {
    retry: false,
  });

  if (error && !companyLoading) {
    setLocation('/company/register');
    return null;
  }

  const { data: employees } = trpc.company.getEmployees.useQuery();
  const { data: stats } = trpc.company.getWellnessStats.useQuery({});
  const { data: responses } = trpc.company.getSurveyResponses.useQuery();

  if (authLoading || companyLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p>Carregando...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!company) {
    return null;
  }

  const avgMood = stats?.avgMood ? Number(stats.avgMood).toFixed(1) : "N/A";
  const avgStress = stats?.avgStress ? Number(stats.avgStress).toFixed(1) : "N/A";
  const avgFatigue = stats?.avgFatigue ? Number(stats.avgFatigue).toFixed(1) : "N/A";
  const avgSatisfaction = stats?.avgSatisfaction ? Number(stats.avgSatisfaction).toFixed(1) : "N/A";

  const getStatusColor = (value: number) => {
    if (value >= 4) return "text-green-600";
    if (value >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getStressColor = (value: number) => {
    if (value <= 2) return "text-green-600";
    if (value <= 3) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard da Empresa</h1>
          <p className="text-muted-foreground">
            {company.companyName}
            {!company.approved && (
              <Badge variant="outline" className="ml-3 text-yellow-600 border-yellow-600">
                Aguardando Aprovação
              </Badge>
            )}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees?.length || 0}</div>
              <p className="text-xs text-muted-foreground">cadastrados na plataforma</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Respostas Coletadas</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalResponses || 0}</div>
              <p className="text-xs text-muted-foreground">questionários respondidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Humor Médio</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats?.avgMood ? getStatusColor(Number(stats.avgMood)) : ''}`}>
                {avgMood}
              </div>
              <p className="text-xs text-muted-foreground">escala de 1 a 5</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nível de Estresse</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats?.avgStress ? getStressColor(Number(stats.avgStress)) : ''}`}>
                {avgStress}
              </div>
              <p className="text-xs text-muted-foreground">escala de 1 a 5</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Indicadores de Bem-Estar</CardTitle>
              <CardDescription>Médias gerais dos últimos questionários</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <span className="font-medium">Humor</span>
                </div>
                <span className={`text-lg font-bold ${stats?.avgMood ? getStatusColor(Number(stats.avgMood)) : ''}`}>
                  {avgMood}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  <span className="font-medium">Estresse</span>
                </div>
                <span className={`text-lg font-bold ${stats?.avgStress ? getStressColor(Number(stats.avgStress)) : ''}`}>
                  {avgStress}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span className="font-medium">Cansaço</span>
                </div>
                <span className={`text-lg font-bold ${stats?.avgFatigue ? getStressColor(Number(stats.avgFatigue)) : ''}`}>
                  {avgFatigue}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  <span className="font-medium">Satisfação</span>
                </div>
                <span className={`text-lg font-bold ${stats?.avgSatisfaction ? getStatusColor(Number(stats.avgSatisfaction)) : ''}`}>
                  {avgSatisfaction}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Respostas Recentes</CardTitle>
              <CardDescription>Últimos questionários respondidos</CardDescription>
            </CardHeader>
            <CardContent>
              {responses && responses.length > 0 ? (
                <div className="space-y-3">
                  {responses.slice(0, 5).map((response) => (
                    <div key={response.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium text-sm">{response.employeeName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(response.responseDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <p className={getStatusColor(response.moodLevel)}>
                          Humor: {response.moodLevel}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhuma resposta registrada ainda
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Employees List */}
        <Card>
          <CardHeader>
            <CardTitle>Funcionários Cadastrados</CardTitle>
            <CardDescription>Lista de colaboradores vinculados à empresa</CardDescription>
          </CardHeader>
          <CardContent>
            {employees && employees.length > 0 ? (
              <div className="space-y-2">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{employee.employeeName}</p>
                      <p className="text-sm text-muted-foreground">{employee.employeeEmail}</p>
                    </div>
                    <div className="text-right text-sm">
                      {employee.department && <p className="text-muted-foreground">{employee.department}</p>}
                      {employee.position && <p className="text-muted-foreground">{employee.position}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum funcionário cadastrado ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
