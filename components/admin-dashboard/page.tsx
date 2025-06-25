"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MessageSquare } from "lucide-react"
import Link from "next/link"

const data = [
  {
    id: "m5gr84i9",
    email: "ken99@yahoo.com",
    name: "Watkins",
    age: 39,
    city: "New York",
    country: "USA",
    status: "Active",
  },
  {
    id: "3u1kri9g",
    email: "zieme.nasir@gmail.com",
    name: "Zieme",
    age: 72,
    city: "Berlin",
    country: "Germany",
    status: "Inactive",
  },
  {
    id: "92ij23fo",
    email: "toy.ratke@yahoo.com",
    name: "Toy",
    age: 22,
    city: "London",
    country: "UK",
    status: "Active",
  },
  {
    id: "0ef1j3fn",
    email: "murphy.renner@hotmail.com",
    name: "Murphy",
    age: 28,
    city: "Paris",
    country: "France",
    status: "Active",
  },
  {
    id: "9w4aj2lk",
    email: "ken99@yahoo.com",
    name: "Watkins",
    age: 39,
    city: "New York",
    country: "USA",
    status: "Active",
  },
  {
    id: "rmt9j2lk",
    email: "zieme.nasir@gmail.com",
    name: "Zieme",
    age: 72,
    city: "Berlin",
    country: "Germany",
    status: "Inactive",
  },
  {
    id: "y49aj1ld",
    email: "toy.ratke@yahoo.com",
    name: "Toy",
    age: 22,
    city: "London",
    country: "UK",
    status: "Active",
  },
  {
    id: "e0f5j8fn",
    email: "murphy.renner@hotmail.com",
    name: "Murphy",
    age: 28,
    city: "Paris",
    country: "France",
    status: "Active",
  },
]

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "age",
    header: () => <div className="text-right">Age</div>,
    cell: (info) => <div className="text-right">{info.getValue()}</div>,
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function AdminDashboardPage() {
  const [open, setOpen] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
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
  })

  const items = [
    {
      title: "Usuarios Activos",
      value: "100",
      percentage: 10,
    },
    {
      title: "Usuarios Inactivos",
      value: "10",
      percentage: -10,
    },
    {
      title: "Nuevos Usuarios",
      value: "5",
      percentage: 5,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>
                {item.value}
                <Badge variant="secondary" className={item.percentage > 0 ? "text-green-500" : "text-red-500"}>
                  {item.percentage}%
                </Badge>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Calendario</CardTitle>
            <CardDescription>Calendario de eventos</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Calendar />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Carousel</CardTitle>
            <CardDescription>Carousel de imagenes</CardDescription>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full max-w-md">
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="flex aspect-square items-center justify-center p-4">{index + 1}</Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Table</CardTitle>
          <CardDescription>Add a description here to describe the table</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter emails..."
              value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
            <Link href="/admin/dashboard?tab=users">
              <Button className="ml-auto">Ver Usuarios</Button>
            </Link>
            <Link href="/admin/dashboard?tab=products">
              <Button className="ml-2">Ver Productos</Button>
            </Link>
            <Link href="/admin/dashboard?tab=orders">
              <Button className="ml-2">Ver Ordenes</Button>
            </Link>
            <Link href="/admin/dashboard?tab=settings">
              <Button className="ml-2">Configuraciones</Button>
            </Link>
            <Link href="/admin/dashboard?tab=analytics">
              <Button className="ml-2">Analiticas</Button>
            </Link>
            <Link href="/admin/dashboard?tab=notifications">
              <Button className="ml-2">Notificaciones</Button>
            </Link>
            <Link href="/admin/dashboard?tab=support">
              <Button className="ml-2">Soporte</Button>
            </Link>
            <Link href="/admin/dashboard?tab=billing">
              <Button className="ml-2">Facturacion</Button>
            </Link>
            <Link href="/admin/dashboard?tab=security">
              <Button className="ml-2">Seguridad</Button>
            </Link>
            <Link href="/admin/dashboard?tab=api">
              <Button className="ml-2">API</Button>
            </Link>
            <Link href="/admin/dashboard?tab=appearance">
              <Button className="ml-2">Apariencia</Button>
            </Link>
            <Link href="/admin/dashboard?tab=integrations">
              <Button className="ml-2">Integraciones</Button>
            </Link>
            <Link href="/admin/dashboard?tab=plugins">
              <Button className="ml-2">Plugins</Button>
            </Link>
            <Link href="/admin/dashboard?tab=updates">
              <Button className="ml-2">Actualizaciones</Button>
            </Link>
            <Link href="/admin/dashboard?tab=system">
              <Button className="ml-2">Sistema</Button>
            </Link>
            <Link href="/admin/dashboard?tab=logs">
              <Button className="ml-2">Logs</Button>
            </Link>
            <Link href="/admin/dashboard?tab=backups">
              <Button className="ml-2">Backups</Button>
            </Link>
            <Link href="/admin/dashboard?tab=reports">
              <Button className="ml-2">Reportes</Button>
            </Link>
            <Link href="/admin/dashboard?tab=audit">
              <Button className="ml-2">Auditoria</Button>
            </Link>
            <Link href="/admin/dashboard?tab=compliance">
              <Button className="ml-2">Cumplimiento</Button>
            </Link>
            <Link href="/admin/dashboard?tab=legal">
              <Button className="ml-2">Legal</Button>
            </Link>
            <Link href="/admin/dashboard?tab=privacy">
              <Button className="ml-2">Privacidad</Button>
            </Link>
            <Link href="/admin/dashboard?tab=terms">
              <Button className="ml-2">Terminos</Button>
            </Link>
            <Link href="/admin/dashboard?tab=accessibility">
              <Button className="ml-2">Accesibilidad</Button>
            </Link>
            <Link href="/admin/dashboard?tab=performance">
              <Button className="ml-2">Rendimiento</Button>
            </Link>
            <Link href="/admin/dashboard?tab=security">
              <Button className="ml-2">Seguridad</Button>
            </Link>
            <Link href="/admin/dashboard?tab=support">
              <Button className="ml-2">Soporte</Button>
            </Link>
            <Link href="/admin/dashboard?tab=feedback">
              <Button className="ml-2">Feedback</Button>
            </Link>
            <Link href="/admin/dashboard?tab=community">
              <Button className="ml-2">Comunidad</Button>
            </Link>
            <Link href="/admin/dashboard?tab=developers">
              <Button className="ml-2">Desarrolladores</Button>
            </Link>
            <Link href="/admin/dashboard?tab=careers">
              <Button className="ml-2">Carreras</Button>
            </Link>
            <Link href="/admin/dashboard?tab=about">
              <Button className="ml-2">Acerca de</Button>
            </Link>
            <Link href="/admin/dashboard?tab=contact">
              <Button className="ml-2">Contacto</Button>
            </Link>
            <Link href="/admin/dashboard?tab=faq">
              <Button className="ml-2">FAQ</Button>
            </Link>
            <Link href="/admin/dashboard?tab=blog">
              <Button className="ml-2">Blog</Button>
            </Link>
            <Link href="/admin/dashboard?tab=press">
              <Button className="ml-2">Prensa</Button>
            </Link>
            <Link href="/admin/dashboard?tab=partners">
              <Button className="ml-2">Socios</Button>
            </Link>
            <Link href="/admin/dashboard?tab=affiliates">
              <Button className="ml-2">Afiliados</Button>
            </Link>
            <Link href="/admin/dashboard?tab=resources">
              <Button className="ml-2">Recursos</Button>
            </Link>
            <Link href="/admin/dashboard?tab=documentation">
              <Button className="ml-2">Documentacion</Button>
            </Link>
            <Link href="/admin/dashboard?tab=tutorials">
              <Button className="ml-2">Tutoriales</Button>
            </Link>
            <Link href="/admin/dashboard?tab=examples">
              <Button className="ml-2">Ejemplos</Button>
            </Link>
            <Link href="/admin/dashboard?tab=templates">
              <Button className="ml-2">Templates</Button>
            </Link>
            <Link href="/admin/dashboard?tab=tools">
              <Button className="ml-2">Herramientas</Button>
            </Link>
            <Link href="/admin/dashboard?tab=downloads">
              <Button className="ml-2">Descargas</Button>
            </Link>
            <Link href="/admin/dashboard?tab=community">
              <Button className="ml-2">Comunidad</Button>
            </Link>
            <Link href="/admin/dashboard?tab=forum">
              <Button className="ml-2">Foro</Button>
            </Link>
            <Link href="/admin/dashboard?tab=chat">
              <Button className="ml-2">Chat</Button>
            </Link>
            <Link href="/admin/dashboard?tab=events">
              <Button className="ml-2">Eventos</Button>
            </Link>
            <Link href="/admin/dashboard?tab=webinars">
              <Button className="ml-2">Webinars</Button>
            </Link>
            <Link href="/admin/dashboard?tab=podcast">
              <Button className="ml-2">Podcast</Button>
            </Link>
            <Link href="/admin/dashboard?tab=videos">
              <Button className="ml-2">Videos</Button>
            </Link>
            <Link href="/admin/dashboard?tab=blog">
              <Button className="ml-2">Blog</Button>
            </Link>
            <Link href="/admin/dashboard?tab=news">
              <Button className="ml-2">Noticias</Button>
            </Link>
            <Link href="/admin/dashboard?tab=updates">
              <Button className="ml-2">Actualizaciones</Button>
            </Link>
            <Link href="/admin/dashboard?tab=status">
              <Button className="ml-2">Estado</Button>
            </Link>
            <Link href="/admin/dashboard?tab=support">
              <Button className="ml-2">Soporte</Button>
            </Link>
            <Link href="/admin/dashboard?tab=contact">
              <Button className="ml-2">Contacto</Button>
            </Link>
            <Link href="/admin/dashboard?tab=feedback">
              <Button className="ml-2">Feedback</Button>
            </Link>
            <Link href="/admin/dashboard?tab=security">
              <Button className="ml-2">Seguridad</Button>
            </Link>
            <Link href="/admin/dashboard?tab=privacy">
              <Button className="ml-2">Privacidad</Button>
            </Link>
            <Link href="/admin/dashboard?tab=terms">
              <Button className="ml-2">Terminos</Button>
            </Link>
            <Link href="/admin/dashboard?tab=accessibility">
              <Button className="ml-2">Accesibilidad</Button>
            </Link>
            <Link href="/admin/dashboard?tab=performance">
              <Button className="ml-2">Rendimiento</Button>
            </Link>
            <Link href="/admin/dashboard?tab=settings">
              <Button className="ml-2">Configuraciones</Button>
            </Link>
            <Link href="/admin/dashboard?tab=analytics">
              <Button className="ml-2">Analiticas</Button>
            </Link>
            <Link href="/admin/dashboard?tab=notifications">
              <Button className="ml-2">Notificaciones</Button>
            </Link>
            <Link href="/admin/dashboard?tab=support">
              <Button className="ml-2">Soporte</Button>
            </Link>
            <Link href="/admin/dashboard?tab=billing">
              <Button className="ml-2">Facturacion</Button>
            </Link>
            <Link href="/admin/dashboard?tab=security">
              <Button className="ml-2">Seguridad</Button>
            </Link>
            <Link href="/admin/dashboard?tab=api">
              <Button className="ml-2">API</Button>
            </Link>
            <Link href="/admin/dashboard?tab=appearance">
              <Button className="ml-2">Apariencia</Button>
            </Link>
            <Link href="/admin/dashboard?tab=integrations">
              <Button className="ml-2">Integraciones</Button>
            </Link>
            <Link href="/admin/dashboard?tab=plugins">
              <Button className="ml-2">Plugins</Button>
            </Link>
            <Link href="/admin/dashboard?tab=updates">
              <Button className="ml-2">Actualizaciones</Button>
            </Link>
            <Link href="/admin/dashboard?tab=system">
              <Button className="ml-2">Sistema</Button>
            </Link>
            <Link href="/admin/dashboard?tab=logs">
              <Button className="ml-2">Logs</Button>
            </Link>
            <Link href="/admin/dashboard?tab=backups">
              <Button className="ml-2">Backups</Button>
            </Link>
            <Link href="/admin/dashboard?tab=reports">
              <Button className="ml-2">Reportes</Button>
            </Link>
            <Link href="/admin/dashboard?tab=audit">
              <Button className="ml-2">Auditoria</Button>
            </Link>
            <Link href="/admin/dashboard?tab=compliance">
              <Button className="ml-2">Cumplimiento</Button>
            </Link>
            <Link href="/admin/dashboard?tab=legal">
              <Button className="ml-2">Legal</Button>
            </Link>
            <Link href="/admin/dashboard?tab=privacy">
              <Button className="ml-2">Privacidad</Button>
            </Link>
            <Link href="/admin/dashboard?tab=terms">
              <Button className="ml-2">Terminos</Button>
            </Link>
            <Link href="/admin/dashboard?tab=accessibility">
              <Button className="ml-2">Accesibilidad</Button>
            </Link>
            <Link href="/admin/dashboard?tab=performance">
              <Button className="ml-2">Rendimiento</Button>
            </Link>
            <Link href="/admin/dashboard?tab=security">
              <Button className="ml-2">Seguridad</Button>
            </Link>
            <Link href="/admin/dashboard?tab=support">
              <Button className="ml-2">Soporte</Button>
            </Link>
            <Link href="/admin/dashboard?tab=feedback">
              <Button className="ml-2">Feedback</Button>
            </Link>
            <Link href="/admin/dashboard?tab=community">
              <Button className="ml-2">Comunidad</Button>
            </Link>
            <Link href="/admin/dashboard?tab=developers">
              <Button className="ml-2">Desarrolladores</Button>
            </Link>
            <Link href="/admin/dashboard?tab=careers">
              <Button className="ml-2">Carreras</Button>
            </Link>
            <Link href="/admin/dashboard?tab=about">
              <Button className="ml-2">Acerca de</Button>
            </Link>
            <Link href="/admin/dashboard?tab=contact">
              <Button className="ml-2">Contacto</Button>
            </Link>
            <Link href="/admin/dashboard?tab=faq">
              <Button className="ml-2">FAQ</Button>
            </Link>
            <Link href="/admin/dashboard?tab=blog">
              <Button className="ml-2">Blog</Button>
            </Link>
            <Link href="/admin/dashboard?tab=press">
              <Button className="ml-2">Prensa</Button>
            </Link>
            <Link href="/admin/dashboard?tab=partners">
              <Button className="ml-2">Socios</Button>
            </Link>
            <Link href="/admin/dashboard?tab=affiliates">
              <Button className="ml-2">Afiliados</Button>
            </Link>
            <Link href="/admin/dashboard?tab=resources">
              <Button className="ml-2">Recursos</Button>
            </Link>
            <Link href="/admin/dashboard?tab=documentation">
              <Button className="ml-2">Documentacion</Button>
            </Link>
            <Link href="/admin/dashboard?tab=tutorials">
              <Button className="ml-2">Tutoriales</Button>
            </Link>
            <Link href="/admin/dashboard?tab=examples">
              <Button className="ml-2">Ejemplos</Button>
            </Link>
            <Link href="/admin/dashboard?tab=templates">
              <Button className="ml-2">Templates</Button>
            </Link>
            <Link href="/admin/dashboard?tab=tools">
              <Button className="ml-2">Herramientas</Button>
            </Link>
            <Link href="/admin/dashboard?tab=downloads">
              <Button className="ml-2">Descargas</Button>
            </Link>
            <Link href="/admin/dashboard?tab=community">
              <Button className="ml-2">Comunidad</Button>
            </Link>
            <Link href="/admin/dashboard?tab=forum">
              <Button className="ml-2">Foro</Button>
            </Link>
            <Link href="/admin/dashboard?tab=chat">
              <Button className="ml-2">Chat</Button>
            </Link>
            <Link href="/admin/dashboard?tab=events">
              <Button className="ml-2">Eventos</Button>
            </Link>
            <Link href="/admin/dashboard?tab=webinars">
              <Button className="ml-2">Webinars</Button>
            </Link>
            <Link href="/admin/dashboard?tab=podcast">
              <Button className="ml-2">Podcast</Button>
            </Link>
            <Link href="/admin/dashboard?tab=videos">
              <Button className="ml-2">Videos</Button>
            </Link>
            <Link href="/admin/dashboard?tab=blog">
              <Button className="ml-2">Blog</Button>
            </Link>
            <Link href="/admin/dashboard?tab=news">
              <Button className="ml-2">Noticias</Button>
            </Link>
            <Link href="/admin/dashboard?tab=updates">
              <Button className="ml-2">Actualizaciones</Button>
            </Link>
            <Link href="/admin/dashboard?tab=status">
              <Button className="ml-2">Estado</Button>
            </Link>
            <Link href="/admin/dashboard?tab=support">
              <Button className="ml-2">Soporte</Button>
            </Link>
            <Link href="/admin/dashboard?tab=contact">
              <Button className="ml-2">Contacto</Button>
            </Link>
            <Link href="/admin/dashboard?tab=feedback">
              <Button className="ml-2">Feedback</Button>
            </Link>
            <Link href="/admin/dashboard?tab=security">
              <Button className="ml-2">Seguridad</Button>
            </Link>
            <Link href="/admin/dashboard?tab=privacy">
              <Button className="ml-2">Privacidad</Button>
            </Link>
            <Link href="/admin/dashboard?tab=terms">
              <Button className="ml-2">Terminos</Button>
            </Link>
            <Link href="/admin/dashboard?tab=accessibility">
              <Button className="ml-2">Accesibilidad</Button>
            </Link>
            <Link href="/admin/dashboard?tab=performance">
              <Button className="ml-2">Rendimiento</Button>
            </Link>
          </div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between space-x-2 py-2">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
              selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Link href="/admin/dashboard?tab=messages">
          <Button variant="outline" className="rounded-full flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Generar Mensaje
          </Button>
        </Link>
      </div>
    </div>
  )
}