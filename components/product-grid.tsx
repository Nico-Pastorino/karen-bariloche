"use client"

import { useStore } from "@/lib/store"
import { ProductCard } from "./product-card"
import { LoadingSpinner } from "./loading-spinner"

export function ProductGrid() {
  const { products, loading } = useStore()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No hay productos disponibles</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}