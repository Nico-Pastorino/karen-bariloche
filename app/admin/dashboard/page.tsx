"use client"

import Link from "next/link"
import Image from "next/image"
import { useStore } from "@/lib/store"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminProductsTable } from "@/components/admin-products-table"
import { PaymentConfigForm } from "@/components/payment-config-form"
import { StoreConfigForm } from "@/components/store-config-form"
import { UpdateDollarButton } from "@/components/update-dollar-button"
import { LowStockAlert } from "@/components/low-stock-alert"

export default function AdminDashboardPage() {
  const { config } = useStore()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "products"

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="logo-container">
              <Image src="/images/kb-logo-new.png" alt={config.storeName} width={40} height={40} />
            </div>
            <span>{config.storeName} Admin</span>
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" className="rounded-full">
                Ver Tienda
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button variant="ghost" className="rounded-full">
                Cerrar sesión
              </Button>
            </Link>
          </nav>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight section-title">Panel de Administración</h2>
          <UpdateDollarButton />
        </div>
        <Tabs defaultValue={defaultTab} className="space-y-4">
          <TabsList className="bg-gray-100 p-1 rounded-full">
            <TabsTrigger value="products" className="rounded-full data-[state=active]:bg-white">
              Productos
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-full data-[state=active]:bg-white">
              Configuración General
            </TabsTrigger>
            <TabsTrigger value="payments" className="rounded-full data-[state=active]:bg-white">
              Métodos de Pago
            </TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-xl font-bold">Gestión de Productos</h3>
            </div>
            <AdminProductsTable />
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <h3 className="text-xl font-bold">Configuración General</h3>
            <StoreConfigForm />
          </TabsContent>
          <TabsContent value="payments" className="space-y-4">
            <h3 className="text-xl font-bold">Métodos de Pago</h3>
            <PaymentConfigForm />
          </TabsContent>
        </Tabs>
      </div>

      {/* Componente de alerta de stock bajo */}
      <LowStockAlert />
    </div>
  )
}