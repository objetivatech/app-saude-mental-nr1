import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { Brain, Activity, Heart, TrendingUp, Calendar } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function EmployeeDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const { data: employee, isLoading: employeeLoading } = trpc.employee.getMyProfile.useQuery();
  const { data: history } = trpc.employee.getMySurveyHistory.useQuery();

  const [surveyData, setSurveyData] = useState({
    moodLevel: 3,
    stressLevel: 3,
    fatigueLevel: 3,
    workSatisfaction: 3,
    observations: "",
  });

  const submitSurveyMutation = trpc.employee.submitSurvey.useMutation({
    onSuccess: () => {
      toast.success("Questionário enviado com sucesso!");
      setSurveyData({
        moodLevel: 3,
        stressLevel: 3,
        fatigueLevel: 3,
        workSatisfaction: 3,
        observations: "",
      });
      utils.employee.getMySurveyHistory.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao enviar questionário");
    },
  });

  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    submitSurveyMutation.mutate(surveyData);
  };

  if (authLoading || employeeLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p>Carregando...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!employee) {
    setLocation('/employee/register');
    return null;
  }

  const getLevelLabel = (value: number) => {
    const labels = ["Muito Baixo", "Baixo", "Médio", "Alto", "Muito Alto"];
    return labels[value - 1] || "Médio";
  };

  const getLevelColor = (value: number, inverted = false) => {
    if (inverted) {
      if (value <= 2) return "text-green-600";
      if (value === 3) return "text-yellow-600";
      return "text-red-600";
    }
    if (value >= 4) return "text-green-600";
    if (value === 3) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Meu Bem-Estar</h1>
          <p className="text-muted-foreground">
            {employee.employeeName} - {employee.department || "Sem departamento"}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Survey Form */}
          <Card>
            <CardHeader>
              <CardTitle>Questionário Semanal</CardTitle>
              <CardDescription>
                Responda como você está se sentindo esta semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitSurvey} className="space-y-6">
                {/* Mood Level */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-primary" />
                      Nível de Humor
                    </Label>
                    <span className={`font-semibold ${getLevelColor(surveyData.moodLevel)}`}>
                      {getLevelLabel(surveyData.moodLevel)}
                    </span>
                  </div>
                  <Slider
                    value={[surveyData.moodLevel]}
                    onValueChange={([value]) => setSurveyData(prev => ({ ...prev, moodLevel: value }))}
                    min={1}
                    max={5}
                    step={1}
                  />
                </div>

                {/* Stress Level */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      Nível de Estresse
                    </Label>
                    <span className={`font-semibold ${getLevelColor(surveyData.stressLevel, true)}`}>
                      {getLevelLabel(surveyData.stressLevel)}
                    </span>
                  </div>
                  <Slider
                    value={[surveyData.stressLevel]}
                    onValueChange={([value]) => setSurveyData(prev => ({ ...prev, stressLevel: value }))}
                    min={1}
                    max={5}
                    step={1}
                  />
                </div>

                {/* Fatigue Level */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Nível de Cansaço
                    </Label>
                    <span className={`font-semibold ${getLevelColor(surveyData.fatigueLevel, true)}`}>
                      {getLevelLabel(surveyData.fatigueLevel)}
                    </span>
                  </div>
                  <Slider
                    value={[surveyData.fatigueLevel]}
                    onValueChange={([value]) => setSurveyData(prev => ({ ...prev, fatigueLevel: value }))}
                    min={1}
                    max={5}
                    step={1}
                  />
                </div>

                {/* Work Satisfaction */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-primary" />
                      Satisfação com o Trabalho
                    </Label>
                    <span className={`font-semibold ${getLevelColor(surveyData.workSatisfaction)}`}>
                      {getLevelLabel(surveyData.workSatisfaction)}
                    </span>
                  </div>
                  <Slider
                    value={[surveyData.workSatisfaction]}
                    onValueChange={([value]) => setSurveyData(prev => ({ ...prev, workSatisfaction: value }))}
                    min={1}
                    max={5}
                    step={1}
                  />
                </div>

                {/* Observations */}
                <div className="space-y-2">
                  <Label htmlFor="observations">Observações (opcional)</Label>
                  <Textarea
                    id="observations"
                    value={surveyData.observations}
                    onChange={(e) => setSurveyData(prev => ({ ...prev, observations: e.target.value }))}
                    placeholder="Compartilhe como está se sentindo ou qualquer preocupação..."
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={submitSurveyMutation.isPending}
                >
                  {submitSurveyMutation.isPending ? "Enviando..." : "Enviar Questionário"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* History */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Respostas</CardTitle>
              <CardDescription>
                Suas respostas anteriores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {history && history.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {history.map((response) => (
                    <div key={response.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(response.responseDate).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Humor:</span>
                          <span className={`ml-2 font-semibold ${getLevelColor(response.moodLevel)}`}>
                            {response.moodLevel}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Estresse:</span>
                          <span className={`ml-2 font-semibold ${getLevelColor(response.stressLevel, true)}`}>
                            {response.stressLevel}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cansaço:</span>
                          <span className={`ml-2 font-semibold ${getLevelColor(response.fatigueLevel, true)}`}>
                            {response.fatigueLevel}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Satisfação:</span>
                          <span className={`ml-2 font-semibold ${getLevelColor(response.workSatisfaction)}`}>
                            {response.workSatisfaction}
                          </span>
                        </div>
                      </div>
                      {response.observations && (
                        <p className="text-sm text-muted-foreground italic mt-2">
                          "{response.observations}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Você ainda não respondeu nenhum questionário
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
