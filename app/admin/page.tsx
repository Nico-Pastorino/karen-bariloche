"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminProductsTable } from "@/components/admin-products-table"
import { StoreConfigForm } from "@/components/store-config-form"
import { PaymentConfigForm } from "@/components/payment-config-form"
import { useStore } from "@/lib/store"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function AdminPage() {
  const { config } = useStore()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [adminUser, setAdminUser] = useState("")

  useEffect(() => {
    // Verificar autenticación
    const authStatus = localStorage.getItem("adminAuthenticated")
    const user = localStorage.getItem("adminUser")

    if (authStatus === "true" && user) {
      setIsAuthenticated(true)
      setAdminUser(user)
    } else {
      router.push("/admin/login")
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    localStorage.removeItem("adminUser")
    router.push("/admin/login")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b bg-white shadow-sm">
        <div className="flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
              <path d="M10 2c1 .5 2 2 2 5" />
            </svg>
            <span>{config.storeName} Admin</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Bienvenido, <span className="font-semibold">{adminUser}</span>
            </span>
            <Link href="/">
              <Button variant="outline">Ver Tienda</Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Panel de Administración</h2>
        </div>
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="settings">Configuración General</TabsTrigger>
            <TabsTrigger value="payments">Métodos de Pago</TabsTrigger>
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
    </div>
  )
}