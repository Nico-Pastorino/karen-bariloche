"use client"

import { useState } from "react"
import { Copy, MessageSquare, Search } from "lucide-react"
import { useStore } from "@/lib/store"
import type { Product } from "@/lib/store"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProductMessageGenerator() {
  const { products, config } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [generatedMessage, setGeneratedMessage] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [activeTab, setActiveTab] = useState("whatsapp")
  const [dialogOpen, setDialogOpen] = useState(false)

  // Filtrar productos según el término de búsqueda
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.color && product.color.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.storageCapacity && product.storageCapacity.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Generar mensaje para el producto seleccionado
  const generateMessage = () => {
    if (!selectedProduct) return

    let message = `*${selectedProduct.name}*\n\n`

    // Agregar detalles del producto
    message += `📱 *Características:*\n`
    message += `• Categoría: ${selectedProduct.category}\n`
    if (selectedProduct.storageCapacity) {
      message += `• Capacidad: ${selectedProduct.storageCapacity}\n`
    }
    if (selectedProduct.color) {
      message += `• Color: ${selectedProduct.color}\n`
    }

    // Agregar condición y detalles específicos
    if (selectedProduct.condition) {
      const conditionText =
        selectedProduct.condition === "new"
          ? "Nuevo"
          : selectedProduct.condition === "refurbished"
            ? "Reacondicionado"
            : "Usado"

      message += `• Condición: ${conditionText}\n`

      // Agregar detalles específicos para productos usados o reacondicionados
      if (selectedProduct.condition === "used" || selectedProduct.condition === "refurbished") {
        if (selectedProduct.batteryPercentage) {
          message += `• Batería: ${selectedProduct.batteryPercentage}%\n`
        }

        if (selectedProduct.hasAppleWarranty !== undefined) {
          message += `• Garantía Apple: ${selectedProduct.hasAppleWarranty ? "Sí" : "No"}\n`
        }
      }
    }

    // Agregar precio
    message += `\n💰 *Precio:*\n`
    if (selectedProduct.isOnSale && selectedProduct.originalPriceARS) {
      message += `• Antes: $${selectedProduct.originalPriceARS.toLocaleString("es-AR")}\n`
      message += `• Ahora: $${selectedProduct.priceARS?.toLocaleString("es-AR")} (${selectedProduct.discountPercentage}% OFF)\n`
    } else {
      message += `• $${selectedProduct.priceARS?.toLocaleString("es-AR")}\n`
    }
    message += `• USD ${selectedProduct.price}\n`

    // Agregar stock
    message += `\n📦 *Stock:*\n`
    message += `• ${selectedProduct.stock} unidades disponibles\n`

    // Agregar mensaje personalizado si existe
    if (customMessage) {
      message += `\n📝 *Nota:*\n${customMessage}\n`
    }

    setGeneratedMessage(message)
  }

  // Copiar mensaje al portapapeles
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage)
    toast({
      title: "Mensaje copiado",
      description: "El mensaje ha sido copiado al portapapeles.",
    })
  }

  // Abrir WhatsApp con el mensaje
  const openWhatsApp = () => {
    const encodedMessage = encodeURIComponent(generatedMessage)
    window.open(`https://web.whatsapp.com/send?phone=${config.whatsappNumber}&text=${encodedMessage}`, "_blank")
  }

  return (
    <>
      <Button className="gap-2 rounded-full" onClick={() => setDialogOpen(true)} id="message-generator-trigger">
        <MessageSquare className="h-4 w-4" />
        Generar Mensaje
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[800px] rounded-xl border-gray-200 shadow-lg">
          <DialogHeader>
            <DialogTitle>Generador de Mensajes</DialogTitle>
            <DialogDescription>
              Busca un producto y genera un mensaje con sus detalles para compartir con clientes.
            </DialogDescription>
          </DialogHeader>

          {/* Resto del contenido del diálogo sin cambios */}
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar Producto</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  placeholder="Buscar por nombre, categoría, color..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Resultados</Label>
              <div className="border rounded-md h-[200px] overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  <div className="divide-y">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className={`p-3 cursor-pointer hover:bg-gray-50 ${
                          selectedProduct?.id === product.id ? "bg-gray-100" : ""
                        }`}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 relative flex-shrink-0">
                            <img
                              src={product.image || "/placeholder.svg?height=40&width=40"}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{product.name}</h4>
                            <div className="flex gap-2 text-xs text-gray-500">
                              <span>{product.category}</span>
                              {product.storageCapacity && <span>• {product.storageCapacity}</span>}
                              {product.color && <span>• {product.color}</span>}
                            </div>
                          </div>
                          <div className="ml-auto text-right">
                            <div className="font-medium">${product.priceARS?.toLocaleString("es-AR")}</div>
                            <div className="text-xs text-gray-500">USD {product.price}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No se encontraron productos
                  </div>
                )}
              </div>
            </div>

            {selectedProduct && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="customMessage">Mensaje Personalizado (opcional)</Label>
                  <Textarea
                    id="customMessage"
                    placeholder="Agrega un mensaje personalizado..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button onClick={generateMessage} className="w-full">
                  Generar Mensaje
                </Button>
              </>
            )}

            {generatedMessage && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Mensaje Generado</h3>
                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-1">
                      <Copy className="h-3.5 w-3.5" />
                      Copiar
                    </Button>
                  </div>
                  <Tabs defaultValue="preview" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="preview" className="flex-1">
                        Vista Previa
                      </TabsTrigger>
                      <TabsTrigger value="raw" className="flex-1">
                        Texto Plano
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview" className="mt-2">
                      <div className="bg-gray-50 p-4 rounded-md max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                        {generatedMessage.split("\n").map((line, index) => {
                          // Aplicar formato básico
                          if (line.startsWith("*") && line.endsWith("*")) {
                            return (
                              <h4 key={index} className="font-bold">
                                {line.replace(/\*/g, "")}
                              </h4>
                            )
                          } else if (line.includes("*")) {
                            return (
                              <p key={index}>
                                {line
                                  .split("*")
                                  .map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
                              </p>
                            )
                          } else {
                            return <p key={index}>{line}</p>
                          }
                        })}
                      </div>
                    </TabsContent>
                    <TabsContent value="raw" className="mt-2">
                      <div className="bg-gray-50 p-4 rounded-md max-h-[300px] overflow-y-auto">
                        <pre className="text-sm whitespace-pre-wrap">{generatedMessage}</pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            {generatedMessage && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="whatsapp">WhatsApp Web</TabsTrigger>
                  <TabsTrigger value="copy">Copiar al Portapapeles</TabsTrigger>
                </TabsList>
                <TabsContent value="whatsapp" className="mt-2">
                  <Button onClick={openWhatsApp} className="w-full gap-2">
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
                    Abrir en WhatsApp Web
                  </Button>
                </TabsContent>
                <TabsContent value="copy" className="mt-2">
                  <Button onClick={copyToClipboard} className="w-full gap-2">
                    <Copy className="h-4 w-4" />
                    Copiar al Portapapeles
                  </Button>
                </TabsContent>
              </Tabs>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}