import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function UserManagement() {
  const utils = trpc.useUtils();

  const { data: users, isLoading } = trpc.admin.getAllUsers.useQuery();

  const deleteUserMutation = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário excluído com sucesso!");
      utils.admin.getAllUsers.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao excluir usuário");
    },
  });

  const handleDeleteUser = (userId: number, userName: string) => {
    deleteUserMutation.mutate({ userId });
  };

  const getUserTypeLabel = (userType: string | null) => {
    const types: Record<string, string> = {
      company: "Empresa",
      employee: "Funcionário",
      health_professional: "Profissional",
      admin: "Administrador",
    };
    return userType ? types[userType] || "Não definido" : "Não definido";
  };

  const getUserTypeBadgeVariant = (userType: string | null) => {
    if (!userType) return "outline";
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      admin: "destructive",
      company: "default",
      employee: "secondary",
      health_professional: "outline",
    };
    return variants[userType] || "outline";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
            <p className="text-muted-foreground">
              Visualize e gerencie todos os usuários da plataforma
            </p>
          </div>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Adicionar Usuário
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todos os Usuários</CardTitle>
            <CardDescription>
              Lista completa de usuários cadastrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-8">Carregando...</p>
            ) : users && users.length > 0 ? (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{user.name || "Sem nome"}</h3>
                        <Badge variant={getUserTypeBadgeVariant(user.userType)}>
                          {getUserTypeLabel(user.userType)}
                        </Badge>
                        {user.role === "admin" && (
                          <Badge variant="destructive">Admin</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {user.email || "Sem e-mail"}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>ID: {user.id}</span>
                        <span>
                          Cadastro: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                        <span>
                          Último acesso: {new Date(user.lastSignedIn).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o usuário <strong>{user.name}</strong>?
                            Esta ação não pode ser desfeita e todos os dados relacionados serão removidos.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.id, user.name || "usuário")}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhum usuário cadastrado
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
