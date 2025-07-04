"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useStore } from "@/lib/store"
import type { Product } from "@/lib/store"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface FilteredProductGridProps {
  products: Product[]
}

export function FilteredProductGrid({ products }: FilteredProductGridProps) {
  const { config } = useStore()

  // Función para generar mensaje de WhatsApp
  const generateWhatsAppMessage = (product: Product) => {
    return `Hola, estoy interesado en el ${product.name} que vi en ${config.storeName}. ¿Me podrías dar más información?`
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No se encontraron productos</h3>
        <p className="text-gray-500 mt-2">Intenta con otros filtros o términos de búsqueda.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden product-card border-gray-200">
          <CardHeader className="p-0">
            <div className="relative aspect-square">
              <Image
                src={product.image || "/placeholder.svg?height=300&width=300"}
                alt={product.name}
                fill
                className="object-contain p-2"
              />
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                {product.isNew && (
                  <Badge className="bg-black text-white" variant="secondary">
                    Nuevo
                  </Badge>
                )}
                {product.isOnSale && (
                  <Badge className="bg-red-500 text-white" variant="secondary">
                    {product.discountPercentage}% OFF
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
            <div className="mt-2">
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                {product.category}
              </Badge>
            </div>
            <div className="mt-4">
              {product.isOnSale && product.originalPriceARS && (
                <p className="text-sm text-gray-500 line-through">
                  $ {product.originalPriceARS.toLocaleString("es-AR")}
                </p>
              )}
              <p className={`font-bold text-lg ${product.isOnSale ? "text-red-600" : ""}`}>
                $ {product.priceARS?.toLocaleString("es-AR")}
              </p>
              <p className="text-xs text-gray-500">USD {product.price}</p>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex gap-2">
            <Link
              href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(generateWhatsAppMessage(product))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button className="w-full gap-2 rounded-full bg-black hover:bg-gray-800 text-white">
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
                Consultar
              </Button>
            </Link>
            <Link href={`/productos/${product.id}`} className="w-full">
              <Button
                variant="outline"
                className="w-full gap-2 rounded-full border-gray-300 hover:bg-gray-50 hover:text-gray-900"
              >
                Ver detalles
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}