"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Edit, Check } from "lucide-react"
import { useStore } from "@/lib/store"
import type { Product } from "@/lib/store"
import { APPLE_COLORS, STORAGE_CAPACITIES, PRODUCT_CATEGORIES } from "@/lib/store"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ImageLibrary } from "@/components/image-library"
import { toast } from "@/components/ui/use-toast"

interface EditProductDialogProps {
  product: Product
}

export function EditProductDialog({ product }: EditProductDialogProps) {
  const { updateProduct } = useStore()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    category: product.category,
    isNew: product.isNew,
    isFeatured: product.isFeatured || false,
    image: product.image,
    // Nuevos campos
    condition: product.condition || "new",
    batteryPercentage: product.batteryPercentage?.toString() || "",
    color: product.color || "",
    colors: parseProductColors(product.colors) || [], // Parsear colores existentes
    storageCapacity: product.storageCapacity || "",
    hasAppleWarranty: product.hasAppleWarranty || false,
  })

  // Función auxiliar para parsear colores
  function parseProductColors(colors: string | string[] | undefined): string[] {
    if (!colors) return []
    if (Array.isArray(colors)) return colors
    if (typeof colors === "string") {
      try {
        const parsed = JSON.parse(colors)
        return Array.isArray(parsed) ? parsed : []
      } catch (e) {
        // Si no es JSON válido, intentar como string simple
        return [colors]
      }
    }
    return []
  }

  // Actualizar el formulario cuando cambia el producto
  useEffect(() => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      isNew: product.isNew,
      isFeatured: product.isFeatured || false,
      image: product.image,
      condition: product.condition || "new",
      batteryPercentage: product.batteryPercentage?.toString() || "",
      color: product.color || "",
      colors: parseProductColors(product.colors) || [],
      storageCapacity: product.storageCapacity || "",
      hasAppleWarranty: product.hasAppleWarranty || false,
    })
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: checked }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageSelect = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }))
  }

  const handleBatteryChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, batteryPercentage: value[0].toString() }))
  }

  const addColorToArray = () => {
    if (!formData.color || formData.colors.includes(formData.color)) return

    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, prev.color],
      color: "", // Limpiar el selector después de añadir
    }))
  }

  const removeColorFromArray = (colorToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((color) => color !== colorToRemove),
    }))
  }

  // Agregar estado de carga
  const [isLoading, setIsLoading] = useState(false)

  // Modificar la función handleSubmit para cerrar automáticamente el modal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Actualizar el producto
      const updatedProduct: Product = {
        ...product,
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        isNew: formData.isNew,
        isFeatured: formData.isFeatured,
        image: formData.image || "/placeholder.svg?height=300&width=300",
        // Nuevos campos
        condition: formData.condition,
        batteryPercentage: formData.batteryPercentage ? Number(formData.batteryPercentage) : undefined,
        color: formData.colors.length > 0 ? formData.colors[0] : "", // Primer color como principal
        colors: formData.colors, // Array de colores
        storageCapacity: formData.storageCapacity,
        hasAppleWarranty: formData.hasAppleWarranty,
      }

      // Actualizar el producto usando el contexto
      await updateProduct(updatedProduct)

      // Cerrar el diálogo automáticamente
      setOpen(false)

      // Mostrar mensaje de éxito
      toast({
        title: "Producto actualizado",
        description: `El producto "${updatedProduct.name}" ha sido actualizado correctamente.`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el producto. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Mostrar/ocultar el campo de porcentaje de batería según la condición
  const showBatteryField = formData.condition === "refurbished"
  // Mostrar/ocultar el campo de garantía de Apple según la condición
  const showWarrantyField = formData.condition === "refurbished"

  return (
    <>
      <Button variant="ghost" className="flex items-center gap-2 w-full justify-start" onClick={() => setOpen(true)}>
        <Edit className="h-4 w-4" />
        Editar
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-xl border-gray-200 shadow-lg">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Editar Producto</DialogTitle>
              <DialogDescription>
                Modifica los detalles del producto. Haz clic en guardar cuando hayas terminado.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Producto</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="iPhone 15 Pro"
                    className="rounded-md border-gray-300"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Precio (USD)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="999"
                    className="rounded-md border-gray-300"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe el producto..."
                  className="rounded-md border-gray-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger id="category" className="rounded-md border-gray-300">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Nuevos campos */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="condition">Condición</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleSelectChange("condition", value)}>
                    <SelectTrigger id="condition" className="rounded-md border-gray-300">
                      <SelectValue placeholder="Selecciona la condición" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Nuevo</SelectItem>
                      <SelectItem value="refurbished">Seminuevo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="colors">Colores Disponibles</Label>
                  <div className="space-y-2">
                    {/* Lista de colores seleccionados */}
                    {formData.colors.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.colors.map((color, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm"
                          >
                            <span>{color}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  colors: prev.colors.filter((_, i) => i !== index),
                                }))
                              }}
                              className="text-red-500 hover:text-red-700 ml-1"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Selector para agregar nuevos colores */}
                    <div className="flex gap-2">
                      <Select
                        value=""
                        onValueChange={(value) => {
                          if (value && !formData.colors.includes(value)) {
                            setFormData((prev) => ({
                              ...prev,
                              colors: [...prev.colors, value],
                            }))
                          }
                        }}
                        className="flex-1"
                      >
                        <SelectTrigger className="rounded-md border-gray-300">
                          <SelectValue placeholder="Agregar color" />
                        </SelectTrigger>
                        <SelectContent>
                          {APPLE_COLORS.filter((color) => !formData.colors.includes(color)).map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storageCapacity">Capacidad de Almacenamiento</Label>
                <Select
                  value={formData.storageCapacity}
                  onValueChange={(value) => handleSelectChange("storageCapacity", value)}
                >
                  <SelectTrigger id="storageCapacity" className="rounded-md border-gray-300">
                    <SelectValue placeholder="Selecciona capacidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {STORAGE_CAPACITIES.map((capacity) => (
                      <SelectItem key={capacity} value={capacity}>
                        {capacity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Campo de porcentaje de batería (solo para seminuevos) */}
              {showBatteryField && (
                <div className="space-y-2">
                  <Label htmlFor="batteryPercentage">
                    Porcentaje de Batería: {formData.batteryPercentage || "100"}%
                  </Label>
                  <Slider
                    id="batteryPercentage"
                    min={1}
                    max={100}
                    step={1}
                    value={formData.batteryPercentage ? [Number(formData.batteryPercentage)] : [100]}
                    onValueChange={handleBatteryChange}
                    className="py-4"
                  />
                </div>
              )}

              {/* Campo de garantía de Apple (solo para seminuevos) */}
              {showWarrantyField && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasAppleWarranty"
                    checked={formData.hasAppleWarranty}
                    onCheckedChange={(checked) => handleSwitchChange("hasAppleWarranty", checked)}
                  />
                  <Label htmlFor="hasAppleWarranty">Tiene garantía oficial de Apple</Label>
                </div>
              )}

              <div className="space-y-2">
                <Label>Imagen del Producto</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="URL de la imagen o selecciona de la biblioteca"
                      className="rounded-md border-gray-300"
                    />
                  </div>
                  <ImageLibrary onSelectImage={handleImageSelect} currentCategory={formData.category} />
                </div>
                {formData.image && (
                  <div className="mt-2 border rounded-md p-2 max-w-[200px]">
                    <img
                      src={formData.image || "/placeholder.svg"}
                      alt="Vista previa"
                      className="w-full h-auto object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=200&width=200"
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleSwitchChange("isFeatured", checked)}
                />
                <Label htmlFor="isFeatured">Marcar como Producto Destacado</Label>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="rounded-full">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" className="rounded-full bg-black hover:bg-gray-800 text-white" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Guardar Cambios
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}