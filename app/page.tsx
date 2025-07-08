"use client"
import Link from "next/link"
import { Tag, ArrowRight, Smartphone } from "lucide-react"
import { useStore } from "@/lib/store"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import ProductList from "@/components/product-list"
import type { Product } from "@/lib/store"

export default function HomePage() {
  const { config, products, loading, refreshData } = useStore()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [productsOnSale, setProductsOnSale] = useState<Product[]>([])
  const [refurbishedProducts, setRefurbishedProducts] = useState<Product[]>([])
  const [hasInitialized, setHasInitialized] = useState(false)

  // Solo refrescar datos una vez al montar el componente
  useEffect(() => {
    if (!hasInitialized) {
      console.log("HomePage: Iniciando carga inicial de datos")
      refreshData().finally(() => {
        setHasInitialized(true)
      })
    }
  }, [hasInitialized, refreshData])

  // Actualizar productos filtrados cuando cambian los productos
  useEffect(() => {
    if (products.length > 0) {
      console.log("HomePage: Actualizando productos filtrados. Total productos:", products.length)

      // Filtrar productos destacados
      const featured = products.filter((product) => product.isFeatured === true)
      console.log("Productos destacados encontrados:", featured.length)
      setFeaturedProducts(featured)

      // Filtrar productos en oferta
      const onSale = products.filter((product) => product.isOnSale === true)
      console.log("Productos en oferta encontrados:", onSale.length)
      setProductsOnSale(onSale)

      // Filtrar productos seminuevos
      const refurbished = products.filter((product) => product.condition === "refurbished")
      console.log("Productos seminuevos encontrados:", refurbished.length)
      setRefurbishedProducts(refurbished)
    } else {
      console.log("HomePage: No hay productos para filtrar")
      setFeaturedProducts([])
      setProductsOnSale([])
      setRefurbishedProducts([])
    }
  }, [products])

  // Definir las secciones disponibles
  const sections = {
    featured: config.showFeaturedProducts && (
      <section key="featured" className="w-full py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-10 section-title">Productos Destacados</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Cargando productos destacados...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <ProductList products={featuredProducts} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No hay productos destacados disponibles.</p>
              <p className="text-sm text-gray-500 mt-2">
                Marca productos como destacados en el panel de administración.
              </p>
            </div>
          )}
          <div className="mt-12 text-center">
            <Link href="/productos">
              <Button variant="outline" className="gap-2 rounded-full border-gray-300 hover:bg-gray-100 px-8">
                Ver todos los productos
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    ),
    sale: config.showSaleSection && (
      <section key="sale" className="w-full py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl section-title">Ofertas Especiales</h2>
            <Link href="/productos?filter=ofertas">
              <Button
                variant="outline"
                className="gap-2 rounded-full border-gray-300 hover:bg-gray-100 whitespace-nowrap"
              >
                <Tag className="w-4 h-4" />
                Ver todas las ofertas
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Cargando ofertas...</p>
            </div>
          ) : productsOnSale.length > 0 ? (
            <ProductList products={productsOnSale} showOnlyOnSale={true} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No hay ofertas disponibles actualmente.</p>
              <p className="text-sm text-gray-500 mt-2">Agrega ofertas desde el panel de administración.</p>
            </div>
          )}
        </div>
      </section>
    ),
    refurbished: config.showRefurbishedSection && (
      <section key="refurbished" className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl section-title">Productos Seminuevos</h2>
            <Link href="/productos?filter=seminuevos">
              <Button
                variant="outline"
                className="gap-2 rounded-full border-gray-300 hover:bg-gray-100 whitespace-nowrap"
              >
                <Smartphone className="w-4 h-4" />
                Ver todos los seminuevos
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Cargando productos seminuevos...</p>
            </div>
          ) : refurbishedProducts.length > 0 ? (
            <ProductList products={refurbishedProducts.slice(0, 4)} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No hay productos seminuevos disponibles.</p>
              <p className="text-sm text-gray-500 mt-2">
                Agrega productos con condición "seminuevo" desde el panel de administración.
              </p>
            </div>
          )}
        </div>
      </section>
    ),
    features: (
      <section key="features" className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gray-100 rounded-full">
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
                  className="h-6 w-6"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Productos Originales</h3>
              <p className="text-gray-600">
                Todos nuestros productos son 100% originales con garantía oficial de Apple.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gray-100 rounded-full">
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
                  className="h-6 w-6"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Asesoramiento Personalizado</h3>
              <p className="text-gray-600">Te ayudamos a elegir el producto que mejor se adapte a tus necesidades.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gray-100 rounded-full">
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
                  className="h-6 w-6"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Facilidades de Pago</h3>
              <p className="text-gray-600">
                Ofrecemos diferentes opciones de pago y financiación en cuotas con tarjetas.
              </p>
            </div>
          </div>
        </div>
      </section>
    ),
  }

  // Obtener el orden de las secciones
  const sectionsOrder = config.sectionsOrder || ["sale", "refurbished", "featured", "features"]

  // Debug: mostrar estado actual
  console.log("HomePage render - Loading:", loading, "Products:", products.length, "HasInitialized:", hasInitialized)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section con imagen de fondo de Bariloche */}
        <section className="relative w-full py-32 md:py-48 lg:py-64 text-white">
          {/* Imagen de fondo */}
            <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/bariloche-mountain2.png')",
              backgroundPosition: "center 10%", // Cambiado de 40% a 10% para subir la imagen
            }}
            >
            {/* Overlay para mejorar la legibilidad del texto */}
            <div className="absolute inset-0 bg-black/30"></div>
            </div>

          <div className="container relative mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6 mt-16">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl drop-shadow-md">
                {config.storeName}
              </h1>
              <p className="text-xl text-white md:text-2xl drop-shadow-md">{config.storeDescription}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link href="/productos">
                  <Button className="w-full sm:w-auto text-base bg-white text-black hover:bg-gray-100 rounded-full px-8 shadow-lg">
                    Ver Productos
                  </Button>
                </Link>
                <Link href={`https://wa.me/${config.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto text-base border-white text-white bg-black/40 hover:bg-white/30 rounded-full px-8 gap-2 shadow-lg backdrop-blur-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="#FFFFFF"
                      stroke="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Consultar por WhatsApp
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Renderizar secciones en el orden configurado */}
        {sectionsOrder.map((sectionId) => sections[sectionId as keyof typeof sections])}
      </main>

      <Footer />
    </div>
  )
}