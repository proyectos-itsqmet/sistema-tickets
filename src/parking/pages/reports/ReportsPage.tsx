import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReports } from "@/hooks/useReports";
import { IncomeChart } from "@/components/reports/IncomeChart";
import { OccupancyChart } from "@/components/reports/OccupancyChart";
import { FrequentVehiclesChart } from "@/components/reports/FrequentVehiclesChart";
import { OperatorActivityChart } from "@/components/reports/OperatorActivityChart";
import { exportToExcel } from "@/lib/exportExcel";
import type {
  IncomeReportData,
  OccupancyReportData,
  FrequentVehicleData,
  OperatorActivityData,
} from "@/interfaces/reports.interface";
import { FileSpreadsheet, RefreshCw } from "lucide-react";

export const ReportsPage = () => {
  const {
    loading,
    getIncomeReport,
    getOccupancyReport,
    getFrequentVehicles,
    getOperatorActivity,
  } = useReports();

  //! Obtener fecha actual y hace 30 días
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [fechaInicio, setFechaInicio] = useState(
    thirtyDaysAgo.toISOString().split("T")[0]
  );
  const [fechaFin, setFechaFin] = useState(today.toISOString().split("T")[0]);
  const [tipoReporte, setTipoReporte] = useState<"diario" | "mensual">(
    "diario"
  );
  const [activeTab, setActiveTab] = useState("ingresos");

  const [incomeData, setIncomeData] = useState<IncomeReportData[]>([]);
  const [occupancyData, setOccupancyData] = useState<OccupancyReportData[]>([]);
  const [frequentData, setFrequentData] = useState<FrequentVehicleData[]>([]);
  const [operatorData, setOperatorData] = useState<OperatorActivityData[]>([]);

  //! Cargar datos según la pestaña activa
  const loadReportData = useCallback(async () => {
    switch (activeTab) {
      case "ingresos": {
        const income = await getIncomeReport(
          fechaInicio,
          fechaFin,
          tipoReporte
        );
        setIncomeData(income);
        break;
      }
      case "ocupacion": {
        const occupancy = await getOccupancyReport(fechaInicio, fechaFin);
        setOccupancyData(occupancy);
        break;
      }
      case "frecuentes": {
        const frequent = await getFrequentVehicles(fechaInicio, fechaFin);
        setFrequentData(frequent);
        break;
      }
      case "operadores": {
        const operators = await getOperatorActivity(fechaInicio, fechaFin);
        setOperatorData(operators);
        break;
      }
    }
  }, [
    activeTab,
    fechaInicio,
    fechaFin,
    tipoReporte,
    getIncomeReport,
    getOccupancyReport,
    getFrequentVehicles,
    getOperatorActivity,
  ]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        await loadReportData();
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [loadReportData]);

  const handleExport = () => {
    const dateRange = { inicio: fechaInicio, fin: fechaFin };

    switch (activeTab) {
      case "ingresos":
        exportToExcel(incomeData, "income", dateRange);
        break;
      case "ocupacion":
        exportToExcel(occupancyData, "occupancy", dateRange);
        break;
      case "frecuentes":
        exportToExcel(frequentData, "frequent", dateRange);
        break;
      case "operadores":
        exportToExcel(operatorData, "operator", dateRange);
        break;
    }
  };

  //! Calcular totales para las tarjetas resumen
  const totalIngresos = incomeData.reduce(
    (sum, item) => sum + item.ingresos,
    0
  );
  const totalTickets = incomeData.reduce(
    (sum, item) => sum + item.cantidad_tickets,
    0
  );
  const avgOccupancy =
    occupancyData.length > 0
      ? occupancyData.reduce(
          (sum, item) => sum + item.porcentaje_ocupacion,
          0
        ) / occupancyData.length
      : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:justify-between md:items-center gap-4 px-2">
        <div className="flex flex-col items-start justify-center">
          <h3 className="text-xl font-semibold">Reportes</h3>
          <span className="text-sm text-gray-400">
            Generación y descarga de informes del sistema
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 px-2">
        <Card className="flex-1 ">
          <CardContent className="pt-4">
            <div className="flex flex-wrap md:flex-row gap-4 items-end">
              <div className="flex flex-col gap-2 flex-1">
                <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <Label htmlFor="fechaFin">Fecha Fin</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <Label>Tipo de Reporte</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full cursor-pointer">
                      {tipoReporte === "diario" ? "Diario" : "Mensual"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
                    <DropdownMenuRadioGroup
                      value={tipoReporte}
                      onValueChange={(value) =>
                        setTipoReporte(value as "diario" | "mensual")
                      }
                    >
                      <DropdownMenuRadioItem value="diario">
                        Diario
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="mensual">
                        Mensual
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={loadReportData}
                  disabled={loading}
                  className="cursor-pointer"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  Actualizar
                </Button>
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-white hover:text-white"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Exportar Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Ingresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              ${totalIngresos.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalTickets}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Ocupación Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {avgOccupancy.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pestañas de reportes */}
      <div className="px-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ingresos" className="cursor-pointer">
              Ingresos de vehiculos
            </TabsTrigger>
            <TabsTrigger value="ocupacion" className="cursor-pointer">
              Ocupación
            </TabsTrigger>
            <TabsTrigger value="frecuentes" className="cursor-pointer">
              Vehículos Frecuentes
            </TabsTrigger>
            <TabsTrigger value="operadores" className="cursor-pointer">
              Actividad Operadores
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ingresos">
            <Card>
              <CardHeader>
                <CardTitle>Reporte de Ingresos de vehiculos</CardTitle>
              </CardHeader>
              <CardContent>
                {incomeData.length > 0 ? (
                  <IncomeChart data={incomeData} tipo={tipoReporte} />
                ) : (
                  <div className="h-80 flex items-center justify-center text-gray-400">
                    No hay datos para mostrar en el rango seleccionado
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ocupacion">
            <Card>
              <CardHeader>
                <CardTitle>Reporte de Ocupación</CardTitle>
              </CardHeader>
              <CardContent>
                {occupancyData.length > 0 ? (
                  <OccupancyChart data={occupancyData} />
                ) : (
                  <div className="h-80 flex items-center justify-center text-gray-400">
                    No hay datos para mostrar en el rango seleccionado
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="frecuentes">
            <Card>
              <CardHeader>
                <CardTitle>Vehículos Frecuentes (Top 10)</CardTitle>
              </CardHeader>
              <CardContent>
                {frequentData.length > 0 ? (
                  <FrequentVehiclesChart data={frequentData} />
                ) : (
                  <div className="h-80 flex items-center justify-center text-gray-400">
                    No hay datos para mostrar en el rango seleccionado
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operadores">
            <Card>
              <CardHeader>
                <CardTitle>Actividad por Operador</CardTitle>
              </CardHeader>
              <CardContent>
                {operatorData.length > 0 ? (
                  <OperatorActivityChart data={operatorData} />
                ) : (
                  <div className="h-80 flex items-center justify-center text-gray-400">
                    No hay datos para mostrar en el rango seleccionado
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
