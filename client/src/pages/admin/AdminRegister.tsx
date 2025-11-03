import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Shield, Loader2, Key } from "lucide-react";

export default function AdminRegister() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const registerMutation = trpc.auth.registerAdmin.useMutation({
    onSuccess: () => {
      toast.success("Administrador criado com sucesso! Faça login para continuar.");
      setLocation("/admin/login");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar administrador");
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (password.length < 8) {
      toast.error("A senha deve ter no mínimo 8 caracteres");
      return;
    }

    setIsLoading(true);
    
    try {
      await registerMutation.mutateAsync({ 
        email, 
        password, 
        name,
        secretKey 
      });
    } catch (error) {
      // Error handled by onError
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Criar Administrador</CardTitle>
          <CardDescription className="text-center">
            Crie uma nova conta de administrador do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">Mínimo de 8 caracteres</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secretKey" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                Chave Secreta de Registro
              </Label>
              <Input
                id="secretKey"
                type="password"
                placeholder="Chave fornecida pelo sistema"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">
                Esta chave é necessária para criar administradores
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Administrador"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Já tem uma conta?{" "}
              <a href="/admin/login" className="text-emerald-600 hover:underline">
                Fazer login
              </a>
            </p>
            <p className="mt-2">
              <a href="/" className="text-emerald-600 hover:underline">
                ← Voltar para página inicial
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
