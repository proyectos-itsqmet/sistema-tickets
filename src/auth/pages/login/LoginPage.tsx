import { LoginForm } from "@/components/auth/LoginForm";
import { LoginHero } from "@/components/auth/LoginHero";

export const LoginPage = () => {
  return (
    <div className="bg-muted flex h-screen gap-6 p-6 md:p-10">
      <div className="hidden xl:flex xl:flex-col xl:w-full shadow-2xl rounded-3xl overflow-hidden">
        <LoginHero />
      </div>
      <div className="flex xl:max-w-lg 2xl:max-w-2xl w-full items-center justify-center">
        <div className="flex w-full max-w-sm xl:max-w-md flex-col gap-6">
          <span className="flex text-center gap-2 self-center font-medium">
            Sistema de Gestión de Tickets de Parqueo Automatizado
          </span>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};
