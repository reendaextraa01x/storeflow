import { SignupForm } from '@/components/auth-forms';

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </main>
  );
}
