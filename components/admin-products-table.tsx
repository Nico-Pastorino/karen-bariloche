"use client"

import { useState } from "react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { MoreHorizontal, ShieldCheck, Battery } from "lucide-react"
import { useStore } from "@/lib/store"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddProductDialog } from "@/components/add-product-dialog"
import { EditProductDialog } from "@/components/edit-product-dialog"
import { DeleteProductDialog } from "@/components/delete-product-dialog"
import { ProductSaleDialog } from "@/components/product-sale-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PRODUCT_CATEGORIES } from "@/lib/store"

export function AdminProductsTable() {
  const { products, toggleProductFeatured } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [conditionFilter, setConditionFilter] = useState<string>("")

  // Filtrar productos según los términos de búsqueda y filtros
  const filteredProducts = products.filter((product) => {
    // Filtro de texto
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.color && product.color.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.storageCapacity && product.storageCapacity.toLowerCase().includes(searchTerm.toLowerCase()))

    // Filtro de categoría
    const matchesCategory = !categoryFilter || categoryFilter === "all" || product.category === categoryFilter

    // Filtro de condición
    const matchesCondition = !conditionFilter || conditionFilter === "all" || product.condition === conditionFilter

    return matchesSearch && matchesCategory && matchesCondition
  })

  // Función para renderizar el indicador de batería
  const renderBatteryIndicator = (percentage?: number) => {
    if (!percentage) return null

    let color = "bg-green-500"
    if (percentage < 50) color = "bg-yellow-500"
    if (percentage < 20) color = "bg-red-500"

    return (
      <div className="flex items-center gap-1">
        <Battery className="h-4 w-4" />
        <div className="w-12 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: `${percentage}%` }}></div>
        </div>
        <span className="text-xs">{percentage}%</span>
      </div>
    )
  }

  // Función para manejar el toggle de producto destacado
  const handleToggleFeatured = async (productId: number) => {
    try {
      await toggleProductFeatured(productId)
    } catch (error) {
      console.error("Error toggling featured status:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <Input
            placeholder="Buscar productos..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {PRODUCT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todas las condiciones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las condiciones</SelectItem>
                <SelectItem value="new">Nuevo</SelectItem>
                <SelectItem value="refurbished">Seminuevo</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setCategoryFilter("")
                setConditionFilter("")
              }}
            >
              Limpiar
            </Button>
          </div>
        </div>
        <AddProductDialog />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio USD</TableHead>
              <TableHead>Precio ARS</TableHead>
              <TableHead>Detalles</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image
                      src={product.image || "/placeholder.svg?height=50&width=50"}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded-md object-contain"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>{product.name}</div>
                    {product.storageCapacity && <div className="text-xs text-gray-500">{product.storageCapacity}</div>}
                    {product.color && <div className="text-xs text-gray-500">{product.color}</div>}
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    {product.isOnSale && product.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">USD {product.originalPrice}</div>
                    )}
                    <div className={product.isOnSale ? "text-red-600 font-medium" : ""}>USD {product.price}</div>
                  </TableCell>
                  <TableCell>
                    {product.isOnSale && product.originalPriceARS && (
                      <div className="text-sm text-gray-500 line-through">
                        $ {product.originalPriceARS.toLocaleString("es-AR")}
                      </div>
                    )}
                    <div className={product.isOnSale ? "text-red-600 font-medium" : ""}>
                      $ {product.priceARS?.toLocaleString("es-AR")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div className="mb-1">
                        <span className="font-medium">Condición:</span>{" "}
                        {product.condition === "new"
                          ? "Nuevo"
                          : product.condition === "refurbished"
                            ? "Seminuevo"
                            : "N/A"}
                      </div>
                      {product.condition === "refurbished" && (
                        <>
                          {product.batteryPercentage && (
                            <div className="mb-1">{renderBatteryIndicator(product.batteryPercentage)}</div>
                          )}
                          {product.hasAppleWarranty && (
                            <div className="flex items-center text-green-600 gap-1 mb-1">
                              <ShieldCheck className="h-3 w-3" />
                              <span className="text-xs">Garantía Apple</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.isNew && <Badge>Nuevo</Badge>}
                      {product.isOnSale && <Badge variant="destructive">{product.discountPercentage}% OFF</Badge>}
                      {!product.isNew && !product.isOnSale && <Badge variant="outline">Regular</Badge>}
                      {product.isFeatured && <Badge variant="secondary">Destacado</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <EditProductDialog product={product} />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <ProductSaleDialog product={product} />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <DeleteProductDialog productId={product.id} productName={product.name} />
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleFeatured(product.id)}>
                          {product.isFeatured ? "Quitar de destacados" : "Marcar como destacado"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  {searchTerm || categoryFilter || conditionFilter
                    ? "No se encontraron productos que coincidan con los filtros."
                    : "No hay productos disponibles."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" size="sm">
            Anterior
          </Button>
          <Button variant="outline" size="sm">
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}