import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Mail, Phone, Award } from "lucide-react";

export default function ProfessionalsList() {
  const { data: professionals, isLoading } = trpc.healthProfessional.getAll.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profissionais da Saúde Mental</h1>
          <p className="text-muted-foreground">
            Profissionais qualificados disponíveis para atendimento
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Carregando...</p>
          </div>
        ) : professionals && professionals.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {professionals.map((professional) => (
              <Card key={professional.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{professional.professionalName}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Award className="w-3 h-3" />
                        {professional.specialty}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {professional.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {professional.bio}
                    </p>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <a 
                        href={`mailto:${professional.contactEmail}`}
                        className="hover:text-primary hover:underline"
                      >
                        {professional.contactEmail}
                      </a>
                    </div>
                    
                    {professional.contactPhone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <a 
                          href={`tel:${professional.contactPhone}`}
                          className="hover:text-primary hover:underline"
                        >
                          {professional.contactPhone}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground">
                      Registro: {professional.registrationNumber}
                    </p>
                  </div>

                  <Button className="w-full" asChild>
                    <a href={`mailto:${professional.contactEmail}`}>
                      Entrar em Contato
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhum profissional cadastrado no momento
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
