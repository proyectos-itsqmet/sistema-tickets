import { LoginForm } from "@/components/auth/LoginForm";

export const LoginPage = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <span className="flex text-center gap-2 self-center font-medium">
          Sistema de Gestión de Tickets de Parqueo Automatizado
        </span>
        <LoginForm />
      </div>
    </div>
  );
};
