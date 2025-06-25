"use client"

import { useState } from "react"
import { Trash, AlertTriangle } from "lucide-react"
import { useStore } from "@/lib/store"

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
import { toast } from "@/components/ui/use-toast"

interface DeleteProductDialogProps {
  productId: number
  productName: string
}

export function DeleteProductDialog({ productId, productName }: DeleteProductDialogProps) {
  const { deleteProduct } = useStore()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      // Eliminar el producto usando el contexto
      await deleteProduct(productId)

      // Cerrar el diálogo automáticamente
      setOpen(false)

      // Mostrar mensaje de éxito
      toast({
        title: "Producto eliminado",
        description: `El producto "${productName}" ha sido eliminado correctamente.`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        className="flex items-center gap-2 w-full justify-start text-red-600"
        onClick={() => setOpen(true)}
      >
        <Trash className="h-4 w-4" />
        Eliminar
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-xl border-gray-200 shadow-lg">
          <DialogHeader>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <DialogTitle className="text-xl">Confirmar eliminación</DialogTitle>
            </div>
            <DialogDescription className="text-center pt-2">
              ¿Estás seguro de que deseas eliminar el producto <span className="font-semibold">"{productName}"</span>?
            </DialogDescription>
            <div className="text-center">
              <span className="text-sm text-red-600">Esta acción no se puede deshacer.</span>
            </div>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-full">
                Cancelar
              </Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} className="rounded-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" /> Eliminar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}