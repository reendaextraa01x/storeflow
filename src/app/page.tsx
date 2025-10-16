import { LoginForm } from '@/components/auth-forms';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
