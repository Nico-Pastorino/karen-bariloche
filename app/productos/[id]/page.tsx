"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CreditCard, Battery, ShieldCheck, ShieldX } from "lucide-react"
import { useParams } from "next/navigation"
import { useStore } from "@/lib/store"
import type { Product } from "@/lib/store"
import { Navbar } from "@/components/navbar"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProductDetailPage() {
  const { id } = useParams()
  const { products, config } = useStore()
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    const productId = Number(id)
    const foundProduct = products.find((p) => p.id === productId)
    if (foundProduct) {
      setProduct(foundProduct)
    }
  }, [id, products])

  if (!product) {
    return (
      <div className="container px-4 py-8 md:py-12 text-center">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
        <p className="mt-4">El producto que estás buscando no existe o ha sido eliminado.</p>
        <Link href="/productos" className="mt-6 inline-block">
          <Button className="rounded-full bg-black hover:bg-gray-800 text-white">Volver a productos</Button>
        </Link>
      </div>
    )
  }

  // Función para generar mensaje de WhatsApp
  const generateWhatsAppMessage = () => {
    return `Hola, estoy interesado en el ${product.name} que vi en ${config.storeName}. ¿Me podrías dar más información?`
  }

  // Asegurarse de que el producto tenga las propiedades necesarias
  const images = product.images || [product.image || "/placeholder.svg?height=500&width=500"]

  // Parse colors from database - handle both string and array formats
  let colors: string[] = ["Estándar"]
  try {
    if (product.colors) {
      // If colors is already an array, use it directly
      if (Array.isArray(product.colors)) {
        colors = product.colors
      } else if (typeof product.colors === "string") {
        // If colors is a JSON string, parse it
        const parsedColors = JSON.parse(product.colors)
        if (Array.isArray(parsedColors) && parsedColors.length > 0) {
          colors = parsedColors
        }
      }
    } else if (product.color) {
      // Fall back to single color if available
      colors = [product.color]
    }
  } catch (error) {
    console.warn("Error parsing colors:", error)
    // Fall back to single color or default
    colors = product.color ? [product.color] : ["Estándar"]
  }

  const specifications = {
    ...(product.specifications || {}),
    ...(product.storageCapacity ? { Almacenamiento: product.storageCapacity } : {}),
    ...(product.color ? { Color: product.color } : {}),
    ...(product.condition
      ? {
          Condición:
            product.condition === "new"
              ? "Nuevo"
              : product.condition === "refurbished"
                ? "Reacondicionado"
                : product.condition === "used"
                  ? "Usado"
                  : "N/A",
        }
      : {}),
    ...(product.batteryPercentage ? { Batería: `${product.batteryPercentage}%` } : {}),
    ...(product.hasAppleWarranty !== undefined ? { "Garantía Apple": product.hasAppleWarranty ? "Sí" : "No" } : {}),
  }
  const financing = product.financing || config.financingOptions
  const financingEntries = Object.entries(financing || {}).filter(
    ([, options]) => Array.isArray(options) && options.length > 0,
  )

  const getCardLabel = (key: string) => {
    if (key === "visa") return "Visa / Mastercard"
    if (key === "naranja") return "Naranja"
    return key
  }

  const palette = [
    {
      icon: "text-blue-600",
      summaryBg: "bg-blue-50 hover:bg-blue-100",
      summaryText: "text-blue-800",
      chevron: "text-blue-600",
      badge: "bg-blue-600",
      cardBg: "from-blue-50 to-blue-100",
    },
    {
      icon: "text-orange-600",
      summaryBg: "bg-orange-50 hover:bg-orange-100",
      summaryText: "text-orange-800",
      chevron: "text-orange-600",
      badge: "bg-orange-600",
      cardBg: "from-orange-50 to-orange-100",
    },
    {
      icon: "text-emerald-600",
      summaryBg: "bg-emerald-50 hover:bg-emerald-100",
      summaryText: "text-emerald-800",
      chevron: "text-emerald-600",
      badge: "bg-emerald-600",
      cardBg: "from-emerald-50 to-emerald-100",
    },
    {
      icon: "text-purple-600",
      summaryBg: "bg-purple-50 hover:bg-purple-100",
      summaryText: "text-purple-800",
      chevron: "text-purple-600",
      badge: "bg-purple-600",
      cardBg: "from-purple-50 to-purple-100",
    },
    {
      icon: "text-sky-600",
      summaryBg: "bg-sky-50 hover:bg-sky-100",
      summaryText: "text-sky-800",
      chevron: "text-sky-600",
      badge: "bg-sky-600",
      cardBg: "from-sky-50 to-sky-100",
    },
    {
      icon: "text-amber-600",
      summaryBg: "bg-amber-50 hover:bg-amber-100",
      summaryText: "text-amber-800",
      chevron: "text-amber-600",
      badge: "bg-amber-600",
      cardBg: "from-amber-50 to-amber-100",
    },
    {
      icon: "text-pink-600",
      summaryBg: "bg-pink-50 hover:bg-pink-100",
      summaryText: "text-pink-800",
      chevron: "text-pink-600",
      badge: "bg-pink-600",
      cardBg: "from-pink-50 to-pink-100",
    },
    {
      icon: "text-indigo-600",
      summaryBg: "bg-indigo-50 hover:bg-indigo-100",
      summaryText: "text-indigo-800",
      chevron: "text-indigo-600",
      badge: "bg-indigo-600",
      cardBg: "from-indigo-50 to-indigo-100",
    },
  ]

  const getCardStyles = (key: string) => {
    if (key === "visa") return palette[0]
    if (key === "naranja") return palette[1]

    // Asignar un color estable basado en el nombre de la tarjeta
    const normalized = key.toLowerCase()
    let hash = 0
    for (let i = 0; i < normalized.length; i++) {
      hash = (hash * 31 + normalized.charCodeAt(i)) % 2147483647
    }
    const index = Math.abs(hash) % palette.length
    return palette[index]
  }

  // Función para renderizar el indicador de batería
  const renderBatteryIndicator = (percentage?: number) => {
    if (!percentage) return null

    let color = "bg-green-500"
    if (percentage < 50) color = "bg-yellow-500"
    if (percentage < 20) color = "bg-red-500"

    return (
      <div className="flex items-center gap-2 mt-2">
        <Battery className="h-5 w-5" />
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: `${percentage}%` }}></div>
        </div>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
    )
  }

  // Función para renderizar el indicador de garantía
  const renderWarrantyIndicator = (hasWarranty?: boolean) => {
    return (
      <div className="flex items-center gap-2 mt-2">
        {hasWarranty ? (
          <>
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-600">Con garantía oficial de Apple</span>
          </>
        ) : (
          <>
            <ShieldX className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium text-amber-600">Sin garantía oficial de Apple</span>
          </>
        )}
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container px-4 py-8 md:py-12">
        <Link href="/productos" className="flex items-center text-sm mb-8 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a productos
        </Link>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border bg-white aspect-square relative">
              <Image
                src={images[0] || "/placeholder.svg?height=500&width=500"}
                alt={product.name}
                fill
                className="object-contain p-4"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg border bg-white aspect-square relative">
                  <Image
                    src={image || "/placeholder.svg?height=100&width=100"}
                    alt={`${product.name} - Vista ${index + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                {product.isNew && <Badge className="bg-black text-white">Nuevo Lanzamiento</Badge>}
                {product.isOnSale && <Badge className="bg-red-500 text-white">{product.discountPercentage}% OFF</Badge>}
              </div>

              {/* Mostrar indicador de batería para productos usados o reacondicionados */}
              {(product.condition === "used" || product.condition === "refurbished") &&
                product.batteryPercentage &&
                renderBatteryIndicator(product.batteryPercentage)}

              {/* Mostrar indicador de garantía para todos los productos */}
              {renderWarrantyIndicator(product.condition === "new" ? true : product.hasAppleWarranty)}
            </div>
            <div>
              {product.isOnSale && product.originalPriceARS && (
                <div className="text-sm text-gray-500 line-through">
                  $ {product.originalPriceARS.toLocaleString("es-AR")}
                </div>
              )}
              <div className={`text-3xl font-bold ${product.isOnSale ? "text-red-600" : ""}`}>
                $ {product.priceARS?.toLocaleString("es-AR")}
              </div>
              <div className="text-sm text-gray-500">USD {product.price}</div>
            </div>
            {/* Mostrar capacidad de almacenamiento si existe */}
            {product.storageCapacity && (
              <div>
                <h3 className="font-medium mb-2">Capacidad</h3>
                <div className="inline-block px-4 py-2 bg-gray-100 rounded-full text-gray-800 font-medium">
                  {product.storageCapacity}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-medium mb-2">{colors.length > 1 ? "Colores disponibles" : "Color"}</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color, index) => (
                  <Button key={index} variant="outline" className="rounded-full">
                    {color}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Link
                href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(generateWhatsAppMessage())}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="w-full gap-2 rounded-full bg-black hover:bg-gray-800 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="#FFFFFF"
                    stroke="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Consultar por WhatsApp
                </Button>
              </Link>
            </div>
            {config.showFinancingOptions && (
              <Card className="border-gray-200 shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Financiación disponible</CardTitle>
                  <CardDescription>Paga en cuotas con las siguientes tarjetas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {financingEntries.length === 0 ? (
                      <p className="text-sm text-gray-500">No hay opciones de financiación configuradas.</p>
                    ) : (
                      financingEntries.map(([cardType, options]) => {
                        const styles = getCardStyles(cardType)
                        return (
                          <div key={cardType}>
                            <div className="flex items-center gap-2 mb-3">
                              <CreditCard className={`h-5 w-5 ${styles.icon}`} />
                              <h4 className="font-semibold text-lg">{getCardLabel(cardType)}</h4>
                            </div>
                            <details className="group">
                              <summary
                                className={`flex items-center justify-between p-3 ${styles.summaryBg} rounded-lg cursor-pointer transition-colors`}
                              >
                                <span className={`font-medium ${styles.summaryText}`}>Ver opciones de financiación</span>
                                <svg
                                  className={`w-5 h-5 ${styles.chevron} transition-transform group-open:rotate-180`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </summary>
                              <div className="mt-3 space-y-2">
                                {options.map((option) => (
                                  <div
                                    key={option.installments}
                                    className={`flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r ${styles.cardBg}`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`${styles.badge} text-white rounded-full w-10 h-10 flex items-center justify-center font-bold`}
                                      >
                                        {option.installments}
                                      </div>
                                      <div>
                                        <div className="font-medium text-gray-800">{option.installments} cuotas</div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-lg font-bold text-gray-800">
                                        $
                                        {Math.round(
                                          (product.priceARS! * (1 + option.interest / 100)) / option.installments,
                                        ).toLocaleString("es-AR")}
                                      </div>
                                      <div className="text-xs text-gray-500">por mes</div>
                                    </div>
                                  </div>
                                ))}
                                <Link
                                  href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(`Hola, me interesa conocer más sobre las opciones de financiación para el ${product.name}`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block"
                                >
                                  <Button className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white gap-2">
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
                                    Más info
                                  </Button>
                                </Link>
                              </div>
                            </details>
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            <Separator />
          </div>
        </div>
        <div className="mt-12">
          <Tabs defaultValue="details">
            <TabsList className="bg-gray-100 p-1 rounded-full">
              <TabsTrigger value="details" className="rounded-full data-[state=active]:bg-white">
                Descripción
              </TabsTrigger>
              <TabsTrigger value="specs" className="rounded-full data-[state=active]:bg-white">
                Especificaciones
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <div className="prose max-w-none">
                <p>{product.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="specs" className="mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(specifications).length > 0 ? (
                  Object.entries(specifications).map(([key, value], index) => (
                    <div key={index} className="space-y-1">
                      <h3 className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                      <p>{value}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2">
                    <p>No hay especificaciones detalladas disponibles para este producto.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
