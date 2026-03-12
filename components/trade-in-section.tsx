"use client"

import { ArrowRightLeft } from "lucide-react"
import { TradeInCalculator } from "@/components/trade-in-calculator"

export function TradeInSection() {
  return (
    <section
      id="plan-canje"
      className="relative overflow-hidden rounded-[36px] border border-[#2b2b2b] bg-gradient-to-br from-[#2b2b2b] via-[#242424] to-[#2b2b2b] p-6 md:p-10 text-white"
    >
      <div className="pointer-events-none absolute right-8 top-8 h-56 w-56 rounded-full bg-white/8 blur-3xl" />
      <div className="pointer-events-none absolute left-8 bottom-8 h-56 w-56 rounded-full bg-white/6 blur-3xl" />

      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] items-start">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/60">
            <ArrowRightLeft className="h-4 w-4" />
            Plan canje
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white">Plan Canje</h2>
          <p className="text-lg text-white/70 max-w-xl">
            Convertí tu iPhone usado en parte de pago y conocé en segundos cuánto te queda por abonar.
          </p>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/50">
              <span>Proceso</span>
              <span>3 pasos</span>
            </div>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full border border-white/15 bg-white/10 flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-white">Seleccioná tu iPhone</p>
                  <p className="text-sm text-white/70">Modelo, capacidad y batería.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full border border-white/15 bg-white/10 flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-white">Te mostramos el valor</p>
                  <p className="text-sm text-white/70">Estimación clara y rápida.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full border border-white/15 bg-white/10 flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-white">Coordinamos la entrega</p>
                  <p className="text-sm text-white/70">Sin compromiso.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden sm:grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Beneficio</p>
              <p className="mt-2 text-sm font-semibold text-white">Tasación sin cargo</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Tiempo</p>
              <p className="mt-2 text-sm font-semibold text-white">Respuesta rápida</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Seguridad</p>
              <p className="mt-2 text-sm font-semibold text-white">Propuesta clara</p>
            </div>
          </div>
        </div>

        <div className="relative mt-8">
          <div className="absolute -inset-5 rounded-[32px] border border-white/15 bg-white/10 shadow-lg" />
          <div className="relative rounded-[26px] bg-white p-2">
            <TradeInCalculator variant="home" />
          </div>
        </div>
      </div>
    </section>
  )
}
