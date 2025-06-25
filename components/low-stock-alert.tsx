"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, X } from "lucide-react"
import { useStore } from "@/lib/store"
import type { Product } from "@/lib/store"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

export function LowStockAlert() {
  const { checkLowStock, config } = useStore()
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [open, setOpen] = useState(false)
  const [showBadge, setShowBadge] = useState(false)

  // Verificar productos con stock bajo al cargar el componente
  useEffect(() => {
    const checkStock = async () => {
      const products = await checkLowStock()
      setLowStockProducts(products)
      setShowBadge(products.length > 0)
    }

    checkStock()

    // Verificar periódicamente (cada hora)
    const interval = setInterval(checkStock, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [checkLowStock])

  // Función para enviar alerta por WhatsApp
  const sendWhatsAppAlert = () => {
    if (lowStockProducts.length === 0) return

    let message = "🚨 *ALERTA DE STOCK BAJO* 🚨\n\n"
    message += "Los siguientes productos están por debajo del umbral de stock:\n\n"

    lowStockProducts.forEach((product) => {
      message += `• *${product.name}*\n`
      message += `  - Stock actual: ${product.stock}\n`
      message += `  - Umbral: ${product.lowStockThreshold}\n`
      message += `  - ID: ${product.id}\n\n`
    })

    message += "Por favor, actualice el inventario o elimine estos productos."

    // Crear URL de WhatsApp con el mensaje
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${config.whatsappNumber}&text=${encodedMessage}`

    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappUrl, "_blank")

    toast({
      title: "Alerta enviada",
      description: "Se ha abierto WhatsApp con la alerta de stock bajo.",
    })
  }

  // Si no hay productos con stock bajo, no mostrar nada
  if (lowStockProducts.length === 0) {
    return null
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {showBadge && (
          <div className="fixed bottom-4 right-4 z-50">
            <Button
              onClick={() => setOpen(true)}
              className="rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Alerta de Stock ({lowStockProducts.length})</span>
            </Button>
          </div>
        )}
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Alerta de Stock Bajo
              </DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription>
              Los siguientes productos están por debajo del umbral de stock configurado.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Stock Actual</TableHead>
                  <TableHead>Umbral</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-amber-600 font-bold">{product.stock}</TableCell>
                    <TableCell>{product.lowStockThreshold}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cerrar
            </Button>
            <Button onClick={sendWhatsAppAlert} className="gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="#FFFFFF"
                stroke="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Enviar alerta por WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}