import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RatesInterface } from "@/interfaces/rates.interface";

interface DisableRateButtonProps {
  rate: RatesInterface;
  onDisableRate: (rateId: number, newTarifa: number) => Promise<void>;
  loading: boolean;
}

export const DisableRateButton = ({
  rate,
  onDisableRate,
  loading,
}: DisableRateButtonProps) => {
  const [open, setOpen] = useState(false);
  const [newTarifa, setNewTarifa] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    const tarifaValue = parseFloat(newTarifa);

    if (!newTarifa || isNaN(tarifaValue) || tarifaValue <= 0) {
      setError("Ingrese una tarifa válida mayor a 0");
      return;
    }

    await onDisableRate(rate.id, tarifaValue);
    setOpen(false);
    setNewTarifa("");
    setError("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setNewTarifa("");
      setError("");
    }
  };

  return (
    <div className="flex justify-end">
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogTrigger asChild>
          <Button
            disabled={!rate.status}
            className={`cursor-pointer ${
              rate.status
                ? "bg-red-500 hover:bg-red-400"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {rate.status ? "Deshabilitar" : "Deshabilitado"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deshabilitar tarifa</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="flex flex-col gap-4">
                <span>
                  Para deshabilitar la tarifa actual de{" "}
                  <strong>${rate.tarifa_por_hora.toFixed(2)}/hora</strong>, debe
                  ingresar una nueva tarifa que la reemplazará.
                </span>
                <div className="flex flex-col gap-2 pt-4">
                  <Label
                    htmlFor="newTarifa"
                    className="text-black font-semibold"
                  >
                    Nueva tarifa por hora ($)
                  </Label>
                  <Input
                    id="newTarifa"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={newTarifa}
                    onChange={(e) => {
                      setNewTarifa(e.target.value);
                      setError("");
                    }}
                    placeholder="Ej: 1.50"
                  />
                  {error && (
                    <span className="text-red-500 text-sm">{error}</span>
                  )}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-400 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleConfirm();
              }}
              disabled={loading}
            >
              {loading ? "Procesando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
