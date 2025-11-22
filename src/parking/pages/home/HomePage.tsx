import { Spinner } from "@/components/ui/spinner";

export const HomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center gap-4">
      <Spinner />
      <span className="text-lg font-semibold">
        Sistema de Gestión de Tickets de Parqueo Automatizado
      </span>
    </div>
  );
};
