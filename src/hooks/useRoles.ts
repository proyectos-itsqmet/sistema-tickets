import { useState, useCallback } from "react";

import type { RolInterface } from "@/interfaces/rol.interface";
import { env } from "@/configs/env";

export const useRoles = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = `${env.API_URL}/roles`;

  //? >>> Obtener todos los roles
  const getRoles = useCallback(async (): Promise<RolInterface[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Error al obtener los roles");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [API_URL]);
  //? <<<

  return {
    loading,
    error,
    getRoles,
  };
};
