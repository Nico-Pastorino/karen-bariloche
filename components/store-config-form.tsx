"use client"

import type React from "react"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { HOME_SECTIONS } from "@/lib/store"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { GripVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function StoreConfigForm() {
  const { config, updateConfig } = useStore()
  const [formData, setFormData] = useState({
    storeName: config.storeName,
    storeDescription: config.storeDescription,
    whatsappNumber: config.whatsappNumber,
    showFeaturedProducts: config.showFeaturedProducts,
    showFinancingOptions: config.showFinancingOptions,
    showSaleSection: config.showSaleSection,
    showRefurbishedSection: config.showRefurbishedSection || true,
    sectionsOrder: config.sectionsOrder || ["sale", "refurbished", "featured", "features"],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  // Manejar el reordenamiento de secciones
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(formData.sectionsOrder)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFormData((prev) => ({ ...prev, sectionsOrder: items }))
  }

  // Agregar estado de carga
  const [isLoading, setIsLoading] = useState(false)

  // Modificar la función handleSubmit para mostrar un toast en lugar de un alert
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Actualizar la configuración usando el contexto
      await updateConfig({
        ...config,
        storeName: formData.storeName,
        storeDescription: formData.storeDescription,
        whatsappNumber: formData.whatsappNumber,
        showFeaturedProducts: formData.showFeaturedProducts,
        showFinancingOptions: formData.showFinancingOptions,
        showSaleSection: formData.showSaleSection,
        showRefurbishedSection: formData.showRefurbishedSection,
        sectionsOrder: formData.sectionsOrder,
      })

      // Mostrar mensaje de éxito
      toast({
        title: "Configuración guardada",
        description: "La configuración de la tienda se ha guardado correctamente.",
      })
    } catch (error) {
      console.error("Error saving store config:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Configuración General de la Tienda</CardTitle>
          <CardDescription>
            Personaliza la información general de tu tienda y las opciones de visualización.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="general">Información General</TabsTrigger>
              <TabsTrigger value="display">Opciones de Visualización</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Nombre de la Tienda</Label>
                <Input
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="iPhone Bariloche"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeDescription">Descripción de la Tienda</Label>
                <Textarea
                  id="storeDescription"
                  name="storeDescription"
                  value={formData.storeDescription}
                  onChange={handleChange}
                  placeholder="Tu tienda Apple en Bariloche"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">Número de WhatsApp</Label>
                <Input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="5491100000000"
                  required
                />
                <p className="text-xs text-gray-500">
                  Ingresa el número completo con código de país, sin espacios ni símbolos. Ejemplo: 5491100000000
                </p>
              </div>
            </TabsContent>

            <TabsContent value="display" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Secciones Visibles</h3>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showFeaturedProducts"
                    checked={formData.showFeaturedProducts}
                    onCheckedChange={(checked) => handleSwitchChange("showFeaturedProducts", checked)}
                  />
                  <Label htmlFor="showFeaturedProducts">Mostrar productos destacados en la página principal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showSaleSection"
                    checked={formData.showSaleSection}
                    onCheckedChange={(checked) => handleSwitchChange("showSaleSection", checked)}
                  />
                  <Label htmlFor="showSaleSection">Mostrar sección de ofertas en la página principal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showRefurbishedSection"
                    checked={formData.showRefurbishedSection}
                    onCheckedChange={(checked) => handleSwitchChange("showRefurbishedSection", checked)}
                  />
                  <Label htmlFor="showRefurbishedSection">Mostrar sección de seminuevos en la página principal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showFinancingOptions"
                    checked={formData.showFinancingOptions}
                    onCheckedChange={(checked) => handleSwitchChange("showFinancingOptions", checked)}
                  />
                  <Label htmlFor="showFinancingOptions">Mostrar opciones de financiación en productos</Label>
                </div>

                <div className="mt-6 space-y-2">
                  <h3 className="text-sm font-medium">Orden de las Secciones</h3>
                  <p className="text-xs text-gray-500">
                    Arrastra y suelta las secciones para cambiar el orden en que aparecen en la página principal.
                  </p>

                  <div className="mt-2 border rounded-md p-4 bg-gray-50">
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="sections" direction="vertical">
                        {(provided, snapshot) => (
                          <ul
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`space-y-3 min-h-[200px] transition-colors duration-200 ${
                              snapshot.isDraggingOver ? "bg-blue-50 border-2 border-dashed border-blue-300" : ""
                            }`}
                          >
                            {formData.sectionsOrder.map((sectionId, index) => {
                              const section = HOME_SECTIONS.find((s) => s.id === sectionId)
                              if (!section) return null

                              return (
                                <Draggable key={sectionId} draggableId={sectionId} index={index}>
                                  {(provided, snapshot) => (
                                    <li
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={`
                                        flex items-center p-4 bg-white rounded-lg border-2 shadow-sm
                                        transition-all duration-200 cursor-move
                                        ${
                                          snapshot.isDragging
                                            ? "border-blue-400 shadow-lg scale-105 rotate-1 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                                        }
                                        ${snapshot.isDropAnimating ? "transition-transform duration-200" : ""}
                                      `}
                                      style={{
                                        ...provided.draggableProps.style,
                                        transform: snapshot.isDragging
                                          ? `${provided.draggableProps.style?.transform} rotate(2deg)`
                                          : provided.draggableProps.style?.transform,
                                      }}
                                    >
                                      <div
                                        {...provided.dragHandleProps}
                                        className="flex items-center justify-center w-8 h-8 mr-3 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                                      >
                                        <GripVertical className="h-5 w-5 text-gray-500" />
                                      </div>
                                      <div className="flex-1">
                                        <span className="font-medium text-gray-900">{section.name}</span>
                                        <p className="text-sm text-gray-500 mt-1">
                                          {section.id === "sale" && "Productos en oferta con descuentos especiales"}
                                          {section.id === "refurbished" && "Productos seminuevos con garantía"}
                                          {section.id === "featured" && "Productos destacados seleccionados"}
                                          {section.id === "features" && "Características y beneficios de la tienda"}
                                        </p>
                                      </div>
                                      <div className="flex items-center text-gray-400">
                                        <span className="text-sm font-medium">#{index + 1}</span>
                                      </div>
                                    </li>
                                  )}
                                </Draggable>
                              )
                            })}
                            {provided.placeholder}
                            {formData.sectionsOrder.length === 0 && (
                              <li className="flex items-center justify-center p-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                                <span>No hay secciones configuradas</span>
                              </li>
                            )}
                          </ul>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto" disabled={isLoading}>
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Guardando...
              </>
            ) : (
              "Guardar Configuración"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}