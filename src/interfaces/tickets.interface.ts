export interface TicketsInterface {
  id: number;
  placa_vehiculo: string;
  fecha_hora_ingreso: string;
  fecha_hora_salida: string;
  tiempo_permanencia: string | null;
  id_operador_ingreso: number;
  id_operador_salida: number | null;
  monto: number | null;
  tarifa: number;
}
