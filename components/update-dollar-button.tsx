"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { useStore } from "@/lib/store"
import { getDollarRates } from "@/lib/api"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function UpdateDollarButton() {
  const { config, updateConfig } = useStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateDollar = async () => {
    setIsLoading(true)
    try {
      const rates = await getDollarRates()

      // Actualizamos la configuración con los nuevos valores
      updateConfig({
        ...config,
        dollarRateBlue: rates.blue,
        dollarRateOfficial: rates.official,
        // Mantenemos el margen adicional de 20 pesos
        dollarRateMargin: 20,
      })

      // Mostramos un mensaje de éxito
      toast({
        title: "Cotización actualizada",
        description: `Dólar Blue: $${rates.blue} | Dólar Oficial: $${rates.official}`,
      })
    } catch (error) {
      // Mostramos un mensaje de error
      toast({
        title: "Error al actualizar",
        description: "No se pudo obtener la cotización actual. Intente nuevamente más tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleUpdateDollar} disabled={isLoading} className="gap-2">
      {isLoading ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin" />
          Actualizando...
        </>
      ) : (
        <>
          <RefreshCw className="h-4 w-4" />
          Actualizar Cotización USD
        </>
      )}
    </Button>
  )
}