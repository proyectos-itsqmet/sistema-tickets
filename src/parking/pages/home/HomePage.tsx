import { Spinner } from "@/components/ui/spinner";

export const HomePage = () => {
  return (
    <div className="min-h-full flex flex-col items-center justify-center gap-4">
      <span className="text-center text-lg font-semibold">
        Sistema de Gestión de Tickets de Parqueo Automatizado
      </span>
      <Spinner />
    </div>
  );
};
