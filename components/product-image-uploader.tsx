"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface ProductImageUploaderProps {
  onImageUpload: (imageUrl: string) => void
  currentImage?: string
}

export function ProductImageUploader({ onImageUpload, currentImage }: ProductImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Esta función simula una carga de imagen
  // En un entorno real, aquí se implementaría la carga a un servicio como Cloudinary, AWS S3, etc.
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setIsUploading(true)

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen (JPG, PNG, etc.)")
      setIsUploading(false)
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no debe superar los 5MB")
      setIsUploading(false)
      return
    }

    // Crear una URL para previsualizar la imagen
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreviewUrl(result)

      // Simular una carga al servidor
      setTimeout(() => {
        // En un entorno real, aquí se devolvería la URL de la imagen cargada al servidor
        // Por ahora, usamos la URL de previsualización local
        onImageUpload(result)
        setIsUploading(false)
      }, 1500)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    onImageUpload("")
  }

  return (
    <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
      <CardContent className="p-6">
        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative w-full h-48 rounded-md overflow-hidden">
              <img src={previewUrl || "/placeholder.svg"} alt="Vista previa" className="w-full h-full object-cover" />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black"
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Imagen cargada correctamente. Puedes eliminarla y cargar otra si lo deseas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-8">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">Subir imagen del producto</h3>
              <p className="text-sm text-gray-500 text-center mt-1">
                Arrastra y suelta una imagen aquí o haz clic para seleccionar
              </p>
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            </div>
            <div className="relative">
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              <Button variant="outline" className="w-full rounded-md" disabled={isUploading}>
                {isUploading ? "Subiendo..." : "Seleccionar imagen"}
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              <p>Formatos soportados: JPG, PNG, GIF</p>
              <p>Tamaño máximo: 5MB</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}