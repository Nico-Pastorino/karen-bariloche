"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { RefreshCw, Plus, X } from "lucide-react"
import { useStore } from "@/lib/store"
import { getDollarRates } from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export function PaymentConfigForm() {
  const { config, updateConfig } = useStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    dollarRateBlue: config.dollarRateBlue,
    dollarRateMargin: config.dollarRateMargin,
    financingOptions: {
      visa: config.financingOptions.visa.map((option) => ({ ...option })),
      naranja: config.financingOptions.naranja.map((option) => ({ ...option })),
    },
  })

  // Actualización automática del dólar blue cada 30 minutos
  useEffect(() => {
    const updateDollarAutomatically = async () => {
      try {
        const rates = await getDollarRates()
        setFormData((prev) => ({
          ...prev,
          dollarRateBlue: rates.blue,
        }))
      } catch (error) {
        console.error("Error al actualizar automáticamente:", error)
      }
    }

    // Actualizar al cargar el componente
    updateDollarAutomatically()

    // Configurar actualización automática cada 30 minutos
    const interval = setInterval(updateDollarAutomatically, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  const handleFinancingChange = (
    cardType: "visa" | "naranja",
    index: number,
    field: "installments" | "interest",
    value: string,
  ) => {
    setFormData((prev) => {
      const newFinancingOptions = { ...prev.financingOptions }
      newFinancingOptions[cardType][index] = {
        ...newFinancingOptions[cardType][index],
        [field]: field === "installments" ? Number.parseInt(value) || 0 : Number.parseFloat(value) || 0,
      }
      return { ...prev, financingOptions: newFinancingOptions }
    })
  }

  const handleInstallmentChange = (
    cardType: "visa" | "naranja",
    index: number,
    field: "installments" | "interest",
    value: string,
  ) => {
    setFormData((prev) => {
      const newFinancingOptions = { ...prev.financingOptions }
      newFinancingOptions[cardType][index] = {
        ...newFinancingOptions[cardType][index],
        [field]: field === "installments" ? Number.parseInt(value) || 1 : Number.parseFloat(value) || 0,
      }
      return { ...prev, financingOptions: newFinancingOptions }
    })
  }

  const addInstallmentOption = (cardType: "visa" | "naranja") => {
    setFormData((prev) => {
      const newFinancingOptions = { ...prev.financingOptions }
      const currentOptions = newFinancingOptions[cardType]

      // Encontrar el siguiente número de cuotas disponible
      const existingInstallments = currentOptions.map((opt) => opt.installments).sort((a, b) => a - b)
      let nextInstallments = 1

      for (let i = 1; i <= 12; i++) {
        if (!existingInstallments.includes(i)) {
          nextInstallments = i
          break
        }
      }

      newFinancingOptions[cardType] = [...currentOptions, { installments: nextInstallments, interest: 0 }].sort(
        (a, b) => a.installments - b.installments,
      )

      return { ...prev, financingOptions: newFinancingOptions }
    })
  }

  const removeInstallmentOption = (cardType: "visa" | "naranja", index: number) => {
    setFormData((prev) => {
      const newFinancingOptions = { ...prev.financingOptions }
      newFinancingOptions[cardType] = newFinancingOptions[cardType].filter((_, i) => i !== index)
      return { ...prev, financingOptions: newFinancingOptions }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Actualizar la configuración usando el contexto
    updateConfig({
      ...config,
      dollarRateBlue: formData.dollarRateBlue,
      dollarRateMargin: formData.dollarRateMargin,
      financingOptions: formData.financingOptions,
    })

    // Mostrar mensaje de éxito
    toast({
      title: "Configuración guardada",
      description: "La configuración de pagos se ha guardado correctamente.",
    })
  }

  const handleUpdateDollar = async () => {
    setIsLoading(true)
    try {
      const rates = await getDollarRates()

      // Actualizamos el formulario con los nuevos valores
      setFormData((prev) => ({
        ...prev,
        dollarRateBlue: rates.blue,
      }))

      // Mostramos un mensaje de éxito
      toast({
        title: "Cotización actualizada",
        description: `Dólar Blue: $${rates.blue}`,
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
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Cotización del Dólar</CardTitle>
              <CardDescription>Configura la cotización del dólar para calcular precios en ARS</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUpdateDollar}
              disabled={isLoading}
              className="h-8 gap-1"
            >
              {isLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              <span className="sr-only md:not-sr-only md:inline-block">Actualizar</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dollarRateBlue">Dólar Blue</Label>
                <Input
                  id="dollarRateBlue"
                  name="dollarRateBlue"
                  type="number"
                  value={formData.dollarRateBlue}
                  onChange={handleChange}
                  placeholder="1300"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dollarRateMargin">Margen adicional (pesos)</Label>
                <Input
                  id="dollarRateMargin"
                  name="dollarRateMargin"
                  type="number"
                  value={formData.dollarRateMargin}
                  onChange={handleChange}
                  placeholder="20"
                  required
                />
                <p className="text-xs text-gray-500">
                  Pesos adicionales sobre el precio en USD (ej: dólar blue + 20 pesos)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Cuotas</CardTitle>
            <CardDescription>Configura los intereses para cada tarjeta y cantidad de cuotas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Visa / Mastercard */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Visa / Mastercard</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addInstallmentOption("visa")}
                    disabled={formData.financingOptions.visa.length >= 12}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar cuota
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {formData.financingOptions.visa.map((option, index) => (
                    <div key={index} className="space-y-2 p-3 border rounded-lg relative">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                          {option.installments} cuota{option.installments > 1 ? "s" : ""}
                        </Label>
                        {formData.financingOptions.visa.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInstallmentOption("visa", index)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Input
                          type="number"
                          min="1"
                          max="12"
                          value={option.installments}
                          onChange={(e) => handleInstallmentChange("visa", index, "installments", e.target.value)}
                          placeholder="Cuotas"
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          value={option.interest}
                          onChange={(e) => handleInstallmentChange("visa", index, "interest", e.target.value)}
                          placeholder="% Interés"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Naranja */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Naranja</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addInstallmentOption("naranja")}
                    disabled={formData.financingOptions.naranja.length >= 12}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar cuota
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {formData.financingOptions.naranja.map((option, index) => (
                    <div key={index} className="space-y-2 p-3 border rounded-lg relative">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                          {option.installments} cuota{option.installments > 1 ? "s" : ""}
                        </Label>
                        {formData.financingOptions.naranja.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInstallmentOption("naranja", index)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Input
                          type="number"
                          min="1"
                          max="12"
                          value={option.installments}
                          onChange={(e) => handleInstallmentChange("naranja", index, "installments", e.target.value)}
                          placeholder="Cuotas"
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          value={option.interest}
                          onChange={(e) => handleInstallmentChange("naranja", index, "interest", e.target.value)}
                          placeholder="% Interés"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 flex justify-end">
        <Button type="submit">Guardar Configuración</Button>
      </div>
    </form>
  )
}