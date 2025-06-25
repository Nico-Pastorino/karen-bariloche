"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import type { Product } from "@/lib/store"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { config } = useStore()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const whatsappMessage = `Hola! Me interesa el ${product.name} - ${product.storage} - ${product.color}. ¿Está disponible?`
  const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.isOnSale && <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">OFERTA</Badge>}
          {product.stock <= 5 && product.stock > 0 && (
            <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600">Últimas unidades</Badge>
          )}
          {product.stock === 0 && <Badge className="absolute top-2 left-2 bg-gray-500">Sin stock</Badge>}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>

          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              {product.storage}
            </Badge>
            {product.colors && product.colors.length > 0 ? (
              product.colors.map((color, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {color}
                </Badge>
              ))
            ) : product.color ? (
              <Badge variant="outline" className="text-xs">
                {product.color}
              </Badge>
            ) : null}
          </div>

          <div className="space-y-1">
            {product.isOnSale && product.originalPrice && (
              <p className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</p>
            )}
            <p className="text-xl font-bold text-green-600">{formatPrice(product.price)}</p>
          </div>

          <div className="flex gap-2 pt-2">
            <Link href={`/productos/${product.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Ver detalles
              </Button>
            </Link>
            {product.stock > 0 && (
              <Link href={whatsappUrl} target="_blank" className="flex-1">
                <Button className="w-full bg-green-600 hover:bg-green-700">Consultar</Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}