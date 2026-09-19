import { useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Usa um email fixo por baixo dos panos para satisfazer o Supabase Auth
    const email = 'admin@gentebonita.com';

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast({
        title: 'Acesso negado',
        description: 'Senha incorreta.',
        variant: 'destructive',
      });
    } else {
      setLocation('/admin');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080709] p-4">
      <Card className="w-full max-w-sm bg-[#111014] border-[#f9eee7]/15 text-[#f9eee7]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-light tracking-wide text-[#df9587]">ÁREA ADMIN</CardTitle>
          <CardDescription className="text-[#a99594]">
            Digite sua senha para acessar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#d1bbb6]">Senha de Acesso</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#080709] border-[#f9eee7]/20 text-[#f9eee7]"
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#d68c80] text-[#24161d] hover:bg-[#df9587] mt-6"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
