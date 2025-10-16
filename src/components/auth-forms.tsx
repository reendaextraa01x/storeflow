'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';

const authSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

export function LoginForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: z.infer<typeof authSchema>) {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro de login',
        description:
          error.code === 'auth/invalid-credential'
            ? 'Credenciais inválidas.'
            : 'Ocorreu um erro. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  }
  
  if (user) {
    router.replace('/dashboard');
    return null;
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center text-center">
        <div className="mb-4">
          <Logo />
        </div>
        <CardTitle className="font-headline text-2xl">Bem-vindo(a) de volta!</CardTitle>
        <CardDescription>Acesse seu painel de controle</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <p>Não tem uma conta?</p>
        <Button variant="link" asChild>
          <Link href="/signup">Cadastre-se</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}


export function SignupForm() {
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
  
    const form = useForm<z.infer<typeof authSchema>>({
      resolver: zodResolver(authSchema),
      defaultValues: { email: '', password: '' },
    });
  
    async function onSubmit(values: z.infer<typeof authSchema>) {
      setLoading(true);
      try {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        router.push('/dashboard');
      } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Erro no cadastro",
            description: error.code === 'auth/email-already-in-use' ? 'Este e-mail já está em uso.' : "Ocorreu um erro. Tente novamente.",
        });
      } finally {
        setLoading(false);
      }
    }

    if (user) {
        router.replace('/dashboard');
        return null;
    }
  
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
            <div className="mb-4">
              <Logo />
            </div>
            <CardTitle className="font-headline text-2xl">Crie sua conta</CardTitle>
            <CardDescription>Comece a gerenciar sua loja hoje</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <p>Já tem uma conta?</p>
          <Button variant="link" asChild>
            <Link href="/">Faça login</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
