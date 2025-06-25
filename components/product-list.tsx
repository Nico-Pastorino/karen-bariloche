"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useStore } from "@/lib/store"
import type { Product } from "@/lib/store"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ProductListProps {
  products: Product[]
  showOnlyOnSale?: boolean
}

export default function ProductList({ products, showOnlyOnSale = false }: ProductListProps) {
  const { config } = useStore()

  // Filtrar productos en oferta si es necesario
  const filteredProducts = showOnlyOnSale ? products.filter((product) => product.isOnSale) : products

  // Función para generar mensaje de WhatsApp
  const generateWhatsAppMessage = (product: Product) => {
    return `Hola, estoy interesado en el ${product.name} que vi en ${config.storeName}. ¿Me podrías dar más información?`
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No hay productos disponibles</h3>
        <p className="text-gray-500 mt-2">
          {showOnlyOnSale ? "No hay productos en oferta actualmente." : "No se encontraron productos."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {filteredProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden product-card border-gray-200">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                <Image
                  src={product.image || "/placeholder.svg?height=300&width=300"}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                />
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="bg-black hover:bg-gray-800 text-white" variant="secondary">
                      Nuevo
                    </Badge>
                  )}
                  {product.isOnSale && (
                    <Badge className="bg-red-500 hover:bg-red-600 text-white" variant="secondary">
                      {product.discountPercentage}% OFF
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <Badge variant="outline" className="mt-1 text-xs bg-gray-50 text-gray-700 border-gray-200">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      {product.isOnSale && product.originalPriceARS && (
                        <p className="text-sm text-gray-500 line-through">
                          $ {product.originalPriceARS.toLocaleString("es-AR")}
                        </p>
                      )}
                      <p
                        className={`font-bold text-lg price-tag ${product.isOnSale ? "text-red-600" : "text-gray-900"}`}
                      >
                        ${" "}
                        {product.priceARS
                          ? product.priceARS.toLocaleString("es-AR")
                          : (product.price * (config.dollarRateBlue + config.dollarRateMargin))
                              .toFixed(0)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </p>
                      <p className="text-xs text-gray-500">USD {product.price}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                </div>
                <div className="flex gap-3 mt-4">
                  <Link
                    href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
                      generateWhatsAppMessage(product),
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full gap-2 bg-black hover:bg-gray-800 text-white rounded-full">
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
                      <span className="hidden sm:inline">Consultar</span>
                    </Button>
                  </Link>
                  <Link href={`/productos/${product.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-full"
                    >
                      <span className="hidden sm:inline">Ver detalles</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}