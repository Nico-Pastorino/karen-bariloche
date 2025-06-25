"use client"

import type React from "react"

import { useState } from "react"
import { Tag, Check } from "lucide-react"
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
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"

interface ProductSaleDialogProps {
  product: Product
}

export function ProductSaleDialog({ product }: ProductSaleDialogProps) {
  const { setProductOnSale } = useStore()
  const [open, setOpen] = useState(false)
  const [isOnSale, setIsOnSale] = useState(product.isOnSale || false)
  const [discountPercentage, setDiscountPercentage] = useState(product.discountPercentage || 10)
  const [isLoading, setIsLoading] = useState(false)

  // Calcular precio con descuento
  const originalPrice = product.originalPrice || product.price
  const discountedPrice = Math.round(originalPrice * (1 - discountPercentage / 100))
  const savings = originalPrice - discountedPrice

  // Modificar la función handleSubmit para cerrar automáticamente el modal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Actualizar el estado de oferta del producto
      await setProductOnSale(product.id, isOnSale, discountPercentage)

      // Cerrar el diálogo automáticamente
      setOpen(false)

      // Mostrar mensaje de éxito
      if (isOnSale) {
        toast({
          title: "Oferta aplicada",
          description: `Producto "${product.name}" con ${discountPercentage}% de descuento`,
          variant: "default",
        })
      } else {
        toast({
          title: "Oferta eliminada",
          description: `Se ha quitado la oferta del producto "${product.name}"`,
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error updating product sale status:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de oferta. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button variant="ghost" className="flex items-center gap-2 w-full justify-start" onClick={() => setOpen(true)}>
        <Tag className="h-4 w-4" />
        {product.isOnSale ? "Modificar oferta" : "Poner en oferta"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-xl border-gray-200 shadow-lg">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {product.isOnSale ? "Modificar oferta del producto" : "Poner producto en oferta"}
              </DialogTitle>
              <DialogDescription>
                {product.isOnSale
                  ? "Modifica el descuento o elimina la oferta del producto."
                  : "Configura el descuento para este producto."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center space-x-2">
                <Switch id="isOnSale" checked={isOnSale} onCheckedChange={setIsOnSale} />
                <Label htmlFor="isOnSale">{isOnSale ? "Producto en oferta" : "Marcar producto como oferta"}</Label>
              </div>

              {isOnSale && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="discountPercentage">Porcentaje de descuento: {discountPercentage}%</Label>
                    </div>
                    <Slider
                      id="discountPercentage"
                      min={5}
                      max={70}
                      step={5}
                      value={[discountPercentage]}
                      onValueChange={(value) => setDiscountPercentage(value[0])}
                      className="py-4"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="space-y-1">
                      <Label>Precio original (USD)</Label>
                      <div className="text-lg font-semibold">${originalPrice}</div>
                    </div>
                    <div className="space-y-1">
                      <Label>Precio con descuento (USD)</Label>
                      <div className="text-lg font-semibold text-red-600">${discountedPrice}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mt-2 border border-gray-100">
                    <div className="text-sm text-gray-700 flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      El cliente ahorrará <span className="font-semibold">${savings}</span> ({discountPercentage}%)
                    </div>
                  </div>
                </>
              )}
            </div>
            <DialogFooter className="flex justify-between items-center">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="rounded-full">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant={isOnSale ? "default" : "secondary"}
                className={`rounded-full ${isOnSale ? "bg-black hover:bg-gray-800" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Guardando...
                  </>
                ) : isOnSale ? (
                  product.isOnSale ? (
                    "Actualizar oferta"
                  ) : (
                    "Crear oferta"
                  )
                ) : (
                  "Quitar oferta"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}