"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { PlusCircle, Check } from "lucide-react"
import { useStore } from "@/lib/store"
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

export function AddProductDialog() {
  const { addProduct } = useStore()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isNew: true,
    isFeatured: false,
    image: "",
    // Nuevos campos
    condition: "new",
    batteryPercentage: "",
    color: "", // Mantener para compatibilidad
    colors: [], // Nuevo campo para múltiples colores
    storageCapacity: "",
    hasAppleWarranty: true, // Por defecto true para productos nuevos
  })

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

  // Efecto para manejar automáticamente la garantía según la condición
  useEffect(() => {
    if (formData.condition === "new") {
      setFormData((prev) => ({ ...prev, hasAppleWarranty: true }))
    } else if (formData.condition === "refurbished") {
      setFormData((prev) => ({ ...prev, hasAppleWarranty: false }))
    }
  }, [formData.condition])

  const handleImageSelect = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }))
  }

  const handleBatteryChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, batteryPercentage: value[0].toString() }))
  }

  // Agregar estado de carga
  const [isLoading, setIsLoading] = useState(false)

  // Modificar la función handleSubmit para cerrar automáticamente el modal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Crear el nuevo producto
      const newProduct = {
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

      // Agregar el producto usando el contexto
      await addProduct(newProduct)

      // Resetear el formulario
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        isNew: true,
        isFeatured: false,
        image: "",
        condition: "new",
        batteryPercentage: "",
        color: "",
        colors: [], // Resetear array de colores
        storageCapacity: "",
        hasAppleWarranty: true,
      })

      // Cerrar el diálogo automáticamente
      setOpen(false)

      // Mostrar mensaje de éxito
      toast({
        title: "Producto agregado",
        description: `El producto "${newProduct.name}" ha sido agregado correctamente.`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el producto. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Mostrar/ocultar el campo de porcentaje de batería según la condición
  const showBatteryField = formData.condition === "refurbished"
  // Mostrar el campo de garantía siempre, pero con diferentes comportamientos
  const showWarrantyField = true

  return (
    <>
      <Button className="gap-2 rounded-full bg-black hover:bg-gray-800 text-white" onClick={() => setOpen(true)}>
        <PlusCircle className="h-4 w-4" />
        Agregar Producto
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-xl border-gray-200 shadow-lg">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Producto</DialogTitle>
              <DialogDescription>
                Completa los detalles del nuevo producto. Haz clic en guardar cuando hayas terminado.
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
              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
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

              {/* Campo de garantía de Apple - Siempre visible con comportamiento automático */}
              {showWarrantyField && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hasAppleWarranty"
                      checked={formData.hasAppleWarranty}
                      onCheckedChange={(checked) => handleSwitchChange("hasAppleWarranty", checked)}
                      disabled={formData.condition === "new"} // Deshabilitado para productos nuevos
                    />
                    <Label htmlFor="hasAppleWarranty">Tiene garantía oficial de Apple</Label>
                  </div>
                  {formData.condition === "new" && (
                    <p className="text-xs text-green-600 font-medium">
                      ✓ Los productos nuevos incluyen automáticamente garantía oficial de Apple
                    </p>
                  )}
                  {formData.condition === "refurbished" && (
                    <p className="text-xs text-gray-500">
                      Indica si este producto seminuevo mantiene la garantía oficial de Apple
                    </p>
                  )}
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
                  id="isNew"
                  checked={formData.isNew}
                  onCheckedChange={(checked) => handleSwitchChange("isNew", checked)}
                />
                <Label htmlFor="isNew">Marcar como Nuevo Lanzamiento</Label>
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
                    <Check className="mr-2 h-4 w-4" /> Guardar Producto
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