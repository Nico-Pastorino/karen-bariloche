"use client"

import { useState, useEffect } from "react"
import { getProductImagesByCategory } from "@/lib/product-images"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ImageLibraryProps {
  onSelectImage: (imageUrl: string) => void
  currentCategory?: string
}

export function ImageLibrary({ onSelectImage, currentCategory }: ImageLibraryProps) {
  const [selectedTab, setSelectedTab] = useState(currentCategory || "iPhones")
  const [images, setImages] = useState<{ id: string; url: string; name: string }[]>([])
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  // Cargar imágenes cuando cambia la categoría seleccionada
  useEffect(() => {
    const categoryImages = getProductImagesByCategory(selectedTab)
    console.log(`Imágenes cargadas para ${selectedTab}:`, categoryImages)
    setImages(categoryImages)

    // Inicializar estados de carga
    const initialLoadingStates: Record<string, boolean> = {}
    categoryImages.forEach((img) => {
      initialLoadingStates[img.id] = true
    })
    setLoadingStates(initialLoadingStates)
  }, [selectedTab])

  const handleImageLoad = (id: string) => {
    console.log(`Imagen cargada exitosamente: ${id}`)
    setLoadingStates((prev) => ({
      ...prev,
      [id]: false,
    }))
  }

  const handleImageError = (id: string, url: string) => {
    console.error(`Error cargando imagen: ${url}`)
    setLoadingStates((prev) => ({
      ...prev,
      [id]: false,
    }))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" type="button" className="rounded-full">
          Seleccionar imagen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] rounded-xl border-gray-200 shadow-lg">
        <DialogHeader>
          <DialogTitle>Biblioteca de imágenes</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="mt-4">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-4 bg-gray-100 p-1 rounded-full">
            <TabsTrigger value="iPhones" className="rounded-full data-[state=active]:bg-white">
              iPhones
            </TabsTrigger>
            <TabsTrigger value="MacBook" className="rounded-full data-[state=active]:bg-white">
              MacBook
            </TabsTrigger>
            <TabsTrigger value="iPad" className="rounded-full data-[state=active]:bg-white">
              iPad
            </TabsTrigger>
            <TabsTrigger value="AirPods" className="rounded-full data-[state=active]:bg-white">
              AirPods
            </TabsTrigger>
            <TabsTrigger value="Accesorios" className="rounded-full data-[state=active]:bg-white">
              Accesorios
            </TabsTrigger>
          </TabsList>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-2">
            {images.length > 0 ? (
              images.map((image) => (
                <div
                  key={image.id}
                  className="border rounded-md overflow-hidden cursor-pointer hover:border-black transition-colors"
                  onClick={() => onSelectImage(image.url)}
                >
                  <div className="relative h-32 bg-gray-50 flex items-center justify-center">
                    {loadingStates[image.id] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                      </div>
                    )}
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.name}
                      className="w-full h-full object-contain"
                      onLoad={() => handleImageLoad(image.id)}
                      onError={() => handleImageError(image.id, image.url)}
                    />
                  </div>
                  <div className="p-2 text-xs text-center truncate">{image.name}</div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-8 text-gray-500">
                No hay imágenes disponibles para esta categoría
              </div>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}