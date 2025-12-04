import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createColumns } from "./ParkingDatatableColumns";
import { useMemo, useState } from "react";
import type { TicketsInterface } from "@/interfaces/tickets.interface";
import { Filter, Search } from "lucide-react";

interface ParkingDatatableProps {
  data: TicketsInterface[];
  onConfirmSalida: (
    ticket: TicketsInterface,
    metodoPago: string
  ) => Promise<void>;
  loading: boolean;
}

type EstadoFiltro = "todos" | "activos" | "finalizados";

export function ParkingDatatable({
  data,
  onConfirmSalida,
  loading,
}: ParkingDatatableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>("todos");

  //! Filtrar datos según el estado seleccionado
  const filteredData = useMemo(() => {
    switch (estadoFiltro) {
      case "activos":
        return data.filter((ticket) => ticket.fecha_hora_salida === null);
      case "finalizados":
        return data.filter((ticket) => ticket.fecha_hora_salida !== null);
      default:
        return data;
    }
  }, [data, estadoFiltro]);

  const estadoLabels: Record<EstadoFiltro, string> = {
    todos: "Todos",
    activos: "Activos",
    finalizados: "Finalizados",
  };

  const columns = useMemo(
    () => createColumns(onConfirmSalida, loading),
    [onConfirmSalida, loading]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por placa..."
            value={
              (table.getColumn("placa_vehiculo")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("placa_vehiculo")
                ?.setFilterValue(event.target.value)
            }
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="cursor-pointer gap-2">
              <Filter className="h-4 w-4" />
              {estadoLabels[estadoFiltro]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={estadoFiltro}
              onValueChange={(value) => setEstadoFiltro(value as EstadoFiltro)}
            >
              <DropdownMenuRadioItem value="todos">Todos</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="activos">
                Activos
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="finalizados">
                Finalizados
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredRowModel().rows.length} línea(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="cursor-pointer"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="cursor-pointer"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
