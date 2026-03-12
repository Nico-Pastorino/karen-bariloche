"use client"

import { useMemo, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { useStore, type TradeInConfig, type TradeInModel } from "@/lib/store"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

function buildEmptyValues(capacities: string[], conditions: string[]) {
  return capacities.reduce<Record<string, Record<string, number | null>>>((acc, capacity) => {
    acc[capacity] = conditions.reduce<Record<string, number | null>>((condAcc, condition) => {
      condAcc[condition] = null
      return condAcc
    }, {})
    return acc
  }, {})
}

export function TradeInAdminTable() {
  const { config, updateConfig } = useStore()
  const [tradeIn, setTradeIn] = useState<TradeInConfig>(config.tradeIn)
  const [isSaving, setIsSaving] = useState(false)

  const tableModels = useMemo(() => tradeIn.models, [tradeIn.models])

  const handleToggle = (checked: boolean) => {
    setTradeIn((prev) => ({ ...prev, enabled: checked }))
  }

  const handleModelNameChange = (index: number, value: string) => {
    setTradeIn((prev) => {
      const models = [...prev.models]
      models[index] = { ...models[index], name: value }
      return { ...prev, models }
    })
  }

  const handleValueChange = (index: number, capacity: string, condition: string, value: string) => {
    const numeric = value === "" ? null : Number(value)
    setTradeIn((prev) => {
      const models = [...prev.models]
      const model = models[index]
      const capacityValues = { ...(model.values[capacity] || {}) }
      capacityValues[condition] = Number.isNaN(numeric) ? null : numeric
      models[index] = {
        ...model,
        values: {
          ...model.values,
          [capacity]: capacityValues,
        },
      }
      return { ...prev, models }
    })
  }

  const handleAddModel = () => {
    setTradeIn((prev) => {
      const newModel: TradeInModel = {
        name: "",
        values: buildEmptyValues(prev.capacities, prev.batteryConditions),
      }
      return { ...prev, models: [...prev.models, newModel] }
    })
  }

  const handleRemoveModel = (index: number) => {
    setTradeIn((prev) => ({ ...prev, models: prev.models.filter((_, i) => i !== index) }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateConfig({
        ...config,
        tradeIn: {
          ...tradeIn,
          updatedAt: new Date().toISOString(),
        },
      })
      toast({
        title: "Plan canje actualizado",
        description: "La tabla de canje se guardó correctamente.",
      })
    } catch (error) {
      console.error("Error saving trade-in config:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la tabla de canje.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="border-gray-200 shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Tabla de canje</CardTitle>
        <CardDescription>Actualizá los valores de toma en USD según capacidad y estado.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Mostrar Plan Canje</Label>
            <p className="text-xs text-gray-500">Activa o desactiva el plan canje en la web.</p>
          </div>
          <Switch checked={tradeIn.enabled} onCheckedChange={handleToggle} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold">Equipos</h4>
            <p className="text-xs text-gray-500">Definí los montos estimados por capacidad y batería.</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddModel} className="rounded-full">
            <Plus className="h-4 w-4 mr-1" /> Agregar modelo
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky left-0 bg-white z-10 border-b border-gray-200 p-3 text-left text-sm font-semibold">
                  Modelo
                </th>
                {tradeIn.capacities.map((capacity) => (
                  <th key={capacity} className="border-b border-gray-200 p-3 text-center text-sm font-semibold">
                    {capacity}
                  </th>
                ))}
              </tr>
              <tr>
                <th className="sticky left-0 bg-white z-10 border-b border-gray-200 p-2"></th>
                {tradeIn.capacities.map((capacity) => (
                  <th key={capacity} className="border-b border-gray-200 p-2 text-center">
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      {tradeIn.batteryConditions.map((condition) => (
                        <span key={condition}>{condition}</span>
                      ))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableModels.map((model, index) => (
                <tr key={`model-${index}`} className="border-b border-gray-100">
                  <td className="sticky left-0 bg-white z-10 p-3">
                    <div className="flex items-center gap-2">
                      <Input
                        value={model.name}
                        onChange={(e) => handleModelNameChange(index, e.target.value)}
                        placeholder="Ej: 13 Pro"
                        className="h-9"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveModel(index)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  {tradeIn.capacities.map((capacity) => (
                    <td key={capacity} className="p-3">
                      <div className="grid grid-cols-2 gap-2">
                        {tradeIn.batteryConditions.map((condition) => (
                          <Input
                            key={`${capacity}-${condition}`}
                            value={
                              model.values?.[capacity]?.[condition] !== null &&
                              model.values?.[capacity]?.[condition] !== undefined
                                ? String(model.values[capacity][condition])
                                : ""
                            }
                            onChange={(e) => handleValueChange(index, capacity, condition, e.target.value)}
                            placeholder="--"
                            type="number"
                            className="h-9 text-center"
                          />
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Última actualización: {tradeIn.updatedAt ? new Date(tradeIn.updatedAt).toLocaleString("es-AR") : "-"}
          </p>
          <Button onClick={handleSave} disabled={isSaving} className="rounded-full">
            {isSaving ? "Guardando..." : "Guardar valores"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
