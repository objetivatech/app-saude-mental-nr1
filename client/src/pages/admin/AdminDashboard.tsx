import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Building2, Stethoscope } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const utils = trpc.useUtils();

  const { data: pendingCompanies, isLoading: loadingCompanies } = trpc.admin.getPendingCompanies.useQuery();
  const { data: pendingProfessionals, isLoading: loadingProfessionals } = trpc.admin.getPendingProfessionals.useQuery();
  const { data: allCompanies } = trpc.admin.getAllCompanies.useQuery();

  const approveCompanyMutation = trpc.admin.approveCompany.useMutation({
    onSuccess: () => {
      toast.success("Empresa aprovada com sucesso!");
      utils.admin.getPendingCompanies.invalidate();
      utils.admin.getAllCompanies.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao aprovar empresa");
    },
  });

  const approveProfessionalMutation = trpc.admin.approveProfessional.useMutation({
    onSuccess: () => {
      toast.success("Profissional aprovado com sucesso!");
      utils.admin.getPendingProfessionals.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao aprovar profissional");
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground">
            Gerencie aprovações e monitore a plataforma
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empresas Cadastradas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allCompanies?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {pendingCompanies?.length || 0} aguardando aprovação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profissionais Pendentes</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingProfessionals?.length || 0}</div>
              <p className="text-xs text-muted-foreground">aguardando aprovação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Aprovações</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(pendingCompanies?.length || 0) + (pendingProfessionals?.length || 0)}
              </div>
              <p className="text-xs text-muted-foreground">pendentes</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Companies */}
        <Card>
          <CardHeader>
            <CardTitle>Empresas Aguardando Aprovação</CardTitle>
            <CardDescription>
              Revise e aprove cadastros de empresas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCompanies ? (
              <p className="text-center py-8">Carregando...</p>
            ) : pendingCompanies && pendingCompanies.length > 0 ? (
              <div className="space-y-4">
                {pendingCompanies.map((company) => (
                  <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{company.companyName}</h3>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          Pendente
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">CNPJ: {company.cnpj}</p>
                      <p className="text-sm text-muted-foreground">
                        Contato: {company.contactEmail}
                      </p>
                    </div>
                    <Button
                      onClick={() => approveCompanyMutation.mutate({ id: company.id })}
                      disabled={approveCompanyMutation.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprovar
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma empresa aguardando aprovação
              </p>
            )}
          </CardContent>
        </Card>

        {/* Pending Professionals */}
        <Card>
          <CardHeader>
            <CardTitle>Profissionais Aguardando Aprovação</CardTitle>
            <CardDescription>
              Revise e aprove cadastros de profissionais da saúde
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingProfessionals ? (
              <p className="text-center py-8">Carregando...</p>
            ) : pendingProfessionals && pendingProfessionals.length > 0 ? (
              <div className="space-y-4">
                {pendingProfessionals.map((professional) => (
                  <div key={professional.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{professional.professionalName}</h3>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          Pendente
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Especialidade: {professional.specialty}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Registro: {professional.registrationNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Contato: {professional.contactEmail}
                      </p>
                    </div>
                    <Button
                      onClick={() => approveProfessionalMutation.mutate({ id: professional.id })}
                      disabled={approveProfessionalMutation.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprovar
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhum profissional aguardando aprovação
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
