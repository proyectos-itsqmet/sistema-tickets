//! Función para formatear fecha ignorando la zona horaria
export const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return "N/A";

  const cleanDateString = dateString.replace("Z", "");
  const date = new Date(cleanDateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

//! Función para calcular el tiempo transcurrido (formato legible)
export const calculateElapsedTime = (fechaIngreso: string | null): string => {
  if (!fechaIngreso) return "N/A";

  const cleanDateString = fechaIngreso.replace("Z", "");
  const ingreso = new Date(cleanDateString);
  const ahora = new Date();

  const diferenciaMilisegundos = ahora.getTime() - ingreso.getTime();
  const minutosTotales = Math.floor(diferenciaMilisegundos / (1000 * 60));
  const horasTotales = Math.floor(minutosTotales / 60);
  const dias = Math.floor(horasTotales / 24);

  const horas = horasTotales % 24;
  const minutos = minutosTotales % 60;

  if (dias > 0) {
    return `${dias}d ${horas}h ${minutos}m`;
  } else if (horas > 0) {
    return `${horas}h ${minutos}m`;
  } else {
    return `${minutos}m`;
  }
};

//! Función para calcular las horas transcurridas (para el cálculo del monto)
export const calculateHours = (fechaIngreso: string | null): number => {
  if (!fechaIngreso) return 0;

  const cleanDateString = fechaIngreso.replace("Z", "");
  const ingreso = new Date(cleanDateString);
  const ahora = new Date();

  const diferenciaMilisegundos = ahora.getTime() - ingreso.getTime();

  //! Convertir a horas (decimales)
  const horasTranscurridas = diferenciaMilisegundos / (1000 * 60 * 60);

  //! Redondear hacia arriba (cobrar hora completa)
  return Math.ceil(horasTranscurridas);
};

//! Función para calcular el monto a pagar
export const calculateAmount = (
  fechaIngreso: string | null,
  tarifaPorHora: number
): number => {
  if (!fechaIngreso || !tarifaPorHora) return 0;

  const horasACobrar = calculateHours(fechaIngreso);
  return horasACobrar * tarifaPorHora;
};
