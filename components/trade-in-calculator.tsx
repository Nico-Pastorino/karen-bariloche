"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRightLeft, Sparkles } from "lucide-react"
import { useStore } from "@/lib/store"
import type { Product } from "@/lib/store"
import { getProductConditionLabel } from "@/lib/whatsapp"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TradeInCalculatorProps {
  variant?: "home" | "product"
  product?: Product
}

export function TradeInCalculator({ variant = "home", product }: TradeInCalculatorProps) {
  const { config } = useStore()
  const tradeIn = config.tradeIn

  const [model, setModel] = useState("")
  const [capacity, setCapacity] = useState("")
  const [battery, setBattery] = useState("")

  useEffect(() => {
    setModel(tradeIn.models[0]?.name || "")
    setCapacity(tradeIn.capacities[0] || "")
    setBattery(tradeIn.batteryConditions[0] || "")
  }, [tradeIn.models, tradeIn.capacities, tradeIn.batteryConditions])

  const selectedModel = useMemo(() => tradeIn.models.find((m) => m.name === model), [tradeIn.models, model])

  const tradeInValue = useMemo(() => {
    if (!selectedModel || !capacity || !battery) return null
    const capacityValues = selectedModel.values?.[capacity]
    const value = capacityValues?.[battery]
    return typeof value === "number" ? value : null
  }, [selectedModel, capacity, battery])

  const totalRate = config.dollarRateBlue + config.dollarRateMargin
  const tradeInValueARS = tradeInValue !== null ? Math.round(tradeInValue * totalRate) : null

  const priceAfterUSD =
    product && tradeInValue !== null ? Math.max(product.price - tradeInValue, 0) : null
  const priceAfterARS =
    product?.priceARS && tradeInValue !== null ? Math.max(product.priceARS - tradeInValueARS!, 0) : null

  const formatMoney = (value: number) => value.toLocaleString("es-AR")

  const whatsappMessage = useMemo(() => {
    const selectedProductLabel = product
      ? `${product.name} (${getProductConditionLabel(product)})`
      : "Sin producto definido"
    const usedDeviceLabel = `${model || "—"} ${capacity || "—"} (Batería ${battery || "—"})`
    const tradeInUsdLabel = tradeInValue !== null ? `US$ ${tradeInValue}` : "Sin cotización"
    const tradeInArsLabel = tradeInValueARS !== null ? `$ ${formatMoney(tradeInValueARS)} ARS` : "Sin cotización"
    const finalUsdLabel = priceAfterUSD !== null ? `US$ ${priceAfterUSD}` : "A definir"
    const finalArsLabel = priceAfterARS !== null ? `$ ${formatMoney(priceAfterARS)} ARS` : "A definir"

    if (product) {
      return [
        "Hola, quiero realizar el plan canje.",
        "",
        `Producto consultado: ${selectedProductLabel}`,
        `Equipo que entrego: ${usedDeviceLabel}`,
        `Valor estimado de mi usado: ${tradeInUsdLabel} (${tradeInArsLabel})`,
        `Monto final a pagar: ${finalUsdLabel} (${finalArsLabel})`,
      ].join("\n")
    }

    return [
      "Hola, quiero coordinar una evaluación para plan canje.",
      "",
      `Equipo que entrego: ${usedDeviceLabel}`,
      `Valor estimado de mi usado: ${tradeInUsdLabel} (${tradeInArsLabel})`,
    ].join("\n")
  }, [product, model, capacity, battery, tradeInValue, tradeInValueARS, priceAfterUSD, priceAfterARS])

  return (
    <Card className="border-gray-200 shadow-sm rounded-2xl bg-white">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-gray-500">
            <ArrowRightLeft className="h-4 w-4" />
            Plan Canje
          </div>
          <span className="rounded-full border border-gray-200 px-2 py-0.5 text-[10px] text-gray-500">
            Estimación
          </span>
        </div>
        <CardTitle className="text-base text-gray-900">
          {variant === "product" && product
            ? `Calcula cuánto pagás por ${product.name}`
            : "Tomamos tu Apple usado y te ayudamos a renovar"}
        </CardTitle>
        <CardDescription>
          Elegí el modelo, capacidad y estado de batería para estimar el valor de tu usado.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Modelo a entregar</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="rounded-full border-gray-200 bg-white">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {tradeIn.models.map((m) => (
                  <SelectItem key={m.name} value={m.name}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Capacidad</Label>
            <Select value={capacity} onValueChange={setCapacity}>
              <SelectTrigger className="rounded-full border-gray-200 bg-white">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {tradeIn.capacities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Condición de batería</Label>
            <Select value={battery} onValueChange={setBattery}>
              <SelectTrigger className="rounded-full border-gray-200 bg-white">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {tradeIn.batteryConditions.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-900 bg-black text-white p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/60">Valor estimado</div>
            <div className="mt-2 text-3xl font-semibold">
              {tradeInValue !== null ? `US$ ${tradeInValue}` : "Sin cotización"}
            </div>
            {tradeInValueARS !== null && (
              <div className="text-sm text-white/70 mt-1">$ {tradeInValueARS.toLocaleString("es-AR")} ARS</div>
            )}
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Detalle</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li className="flex items-center justify-between">
                <span>Modelo</span>
                <span className="font-semibold text-gray-900">{model || "—"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Capacidad</span>
                <span className="font-semibold text-gray-900">{capacity || "—"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Batería</span>
                <span className="font-semibold text-gray-900">{battery || "—"}</span>
              </li>
            </ul>
          </div>
        </div>

        {product && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-600 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="h-4 w-4" />
              Pagás por el iPhone
            </div>
            <div className="mt-2 text-2xl font-semibold text-gray-900">
              {priceAfterUSD !== null ? `US$ ${priceAfterUSD}` : "Seleccioná un usado"}
            </div>
            {priceAfterARS !== null && (
              <div className="text-sm text-gray-600 mt-1">$ {priceAfterARS.toLocaleString("es-AR")} ARS</div>
            )}
          </div>
        )}

        <Button className="w-full rounded-full bg-black hover:bg-gray-800 text-white" asChild>
          <a
            href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Quiero entregar mi usado
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
