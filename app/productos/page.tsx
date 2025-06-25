"use client"

import { useState, useEffect } from "react"
import { Filter, Tag, Smartphone } from "lucide-react"
import { useStore } from "@/lib/store"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductList from "@/components/product-list"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function ProductsPage() {
  const { products } = useStore()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("todos")

  // Categorías actualizadas
  const categories = ["iPhones", "MacBook", "iPad", "AirPods", "iMac", "Accesorios"]

  // Verificar si hay un filtro en la URL
  useEffect(() => {
    const filter = searchParams.get("filter")
    if (filter === "ofertas") {
      setActiveTab("ofertas")
    } else if (filter === "seminuevos") {
      setActiveTab("seminuevos")
    }

    const category = searchParams.get("category")
    if (category) {
      setSelectedCategory(category)
    }

    // Agregar manejo del parámetro de búsqueda
    const search = searchParams.get("search")
    if (search) {
      setSearchTerm(search)
    }
  }, [searchParams])

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    // Filtro por búsqueda
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro por categoría
    const matchesCategory = selectedCategory === null || product.category === selectedCategory

    // Filtro por rango de precio
    let matchesPrice = true
    if (selectedPriceRange) {
      switch (selectedPriceRange) {
        case "under500":
          matchesPrice = product.price < 500
          break
        case "500to1000":
          matchesPrice = product.price >= 500 && product.price <= 1000
          break
        case "1000to2000":
          matchesPrice = product.price > 1000 && product.price <= 2000
          break
        case "over2000":
          matchesPrice = product.price > 2000
          break
      }
    }

    // Filtro por tab
    let matchesTab = true
    if (activeTab === "nuevos") {
      matchesTab = product.isNew
    } else if (activeTab === "ofertas") {
      matchesTab = product.isOnSale || false
    } else if (activeTab === "seminuevos") {
      matchesTab = product.condition === "refurbished"
    }

    return matchesSearch && matchesCategory && matchesPrice && matchesTab
  })

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category)
  }

  const handlePriceRangeClick = (range: string) => {
    setSelectedPriceRange(selectedPriceRange === range ? null : range)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight section-title">Productos Apple</h1>
              <p className="text-gray-600 mt-4">Explora nuestra selección de productos Apple premium.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-full md:w-auto">
                <Input
                  placeholder="Buscar productos..."
                  className="w-full md:w-[300px] rounded-full border-gray-300 pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden rounded-full">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filtrar</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="rounded-r-xl">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                    <SheetDescription>Filtra los productos por categoría, precio y más.</SheetDescription>
                  </SheetHeader>
                  <Separator className="my-4" />
                  <div className="grid gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Categorías</h3>
                      <div className="grid gap-2">
                        {categories.map((category) => (
                          <Button
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            className="justify-start rounded-full"
                            onClick={() => handleCategoryClick(category)}
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Precio</h3>
                      <div className="grid gap-2">
                        <Button
                          variant={selectedPriceRange === "under500" ? "default" : "outline"}
                          className="justify-start rounded-full"
                          onClick={() => handlePriceRangeClick("under500")}
                        >
                          Menos de $500
                        </Button>
                        <Button
                          variant={selectedPriceRange === "500to1000" ? "default" : "outline"}
                          className="justify-start rounded-full"
                          onClick={() => handlePriceRangeClick("500to1000")}
                        >
                          $500 - $1000
                        </Button>
                        <Button
                          variant={selectedPriceRange === "1000to2000" ? "default" : "outline"}
                          className="justify-start rounded-full"
                          onClick={() => handlePriceRangeClick("1000to2000")}
                        >
                          $1000 - $2000
                        </Button>
                        <Button
                          variant={selectedPriceRange === "over2000" ? "default" : "outline"}
                          className="justify-start rounded-full"
                          onClick={() => handlePriceRangeClick("over2000")}
                        >
                          Más de $2000
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="hidden md:block w-[240px] flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="font-medium mb-4 text-sm uppercase tracking-wider">Categorías</h3>
                <div className="grid gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="justify-start rounded-full"
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
                <Separator className="my-6" />
                <h3 className="font-medium mb-4 text-sm uppercase tracking-wider">Precio</h3>
                <div className="grid gap-2">
                  <Button
                    variant={selectedPriceRange === "under500" ? "default" : "outline"}
                    className="justify-start rounded-full"
                    onClick={() => handlePriceRangeClick("under500")}
                  >
                    Menos de $500
                  </Button>
                  <Button
                    variant={selectedPriceRange === "500to1000" ? "default" : "outline"}
                    className="justify-start rounded-full"
                    onClick={() => handlePriceRangeClick("500to1000")}
                  >
                    $500 - $1000
                  </Button>
                  <Button
                    variant={selectedPriceRange === "1000to2000" ? "default" : "outline"}
                    className="justify-start rounded-full"
                    onClick={() => handlePriceRangeClick("1000to2000")}
                  >
                    $1000 - $2000
                  </Button>
                  <Button
                    variant={selectedPriceRange === "over2000" ? "default" : "outline"}
                    className="justify-start rounded-full"
                    onClick={() => handlePriceRangeClick("over2000")}
                  >
                    Más de $2000
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <Tabs defaultValue={activeTab} className="mb-8" onValueChange={handleTabChange} value={activeTab}>
                <TabsList className="bg-gray-100 p-1 rounded-full">
                  <TabsTrigger value="todos" className="rounded-full data-[state=active]:bg-white">
                    Todos
                  </TabsTrigger>
                  <TabsTrigger value="nuevos" className="rounded-full data-[state=active]:bg-white">
                    Nuevos
                  </TabsTrigger>
                  <TabsTrigger
                    value="ofertas"
                    className="rounded-full data-[state=active]:bg-white flex items-center gap-1"
                  >
                    <Tag className="h-3.5 w-3.5" />
                    Ofertas
                  </TabsTrigger>
                  <TabsTrigger
                    value="seminuevos"
                    className="rounded-full data-[state=active]:bg-white flex items-center gap-1"
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    Seminuevos
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="todos">
                  <ProductList products={filteredProducts} />
                </TabsContent>
                <TabsContent value="nuevos">
                  <ProductList products={filteredProducts} />
                </TabsContent>
                <TabsContent value="ofertas">
                  <ProductList products={filteredProducts} />
                </TabsContent>
                <TabsContent value="seminuevos">
                  <ProductList products={filteredProducts} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}