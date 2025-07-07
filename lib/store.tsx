"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { getDollarRates } from "@/lib/api"
import {
  getProducts,
  getConfig,
  addProduct,
  updateProduct,
  deleteProduct,
  setProductOnSale,
  updateConfig,
  checkLowStockProducts,
  toggleProductFeatured,
} from "@/lib/actions"

// Tipos
export interface Product {
  id: number
  name: string
  description: string
  price: number
  priceARS?: number
  category: string
  stock: number
  isNew: boolean
  isFeatured?: boolean
  isOnSale?: boolean
  originalPrice?: number
  originalPriceARS?: number
  discountPercentage?: number
  image?: string
  images?: string[]
  // Nuevos campos
  condition?: "new" | "refurbished" | string
  batteryPercentage?: number
  color?: string
  colors?: string[] // Nuevo campo para múltiples colores
  storageCapacity?: string
  lowStockThreshold?: number
  lastStockAlert?: string
  hasAppleWarranty?: boolean
  // Campos adicionales
  features?: string[]
  specifications?: Record<string, string>
  financing?: FinancingOptions
  createdAt?: string
  updatedAt?: string
}

// Constantes para colores de Apple actualizadas con iPhone 16 series
export const APPLE_COLORS = [
  // iPhone 16 Pro y Pro Max colores
  "Black Titanium",
  "White Titanium",
  "Natural Titanium",
  "Desert Titanium",

  // iPhone 16 y 16 Plus colores
  "Black",
  "White",
  "Pink",
  "Teal",
  "Ultramarine",

  // Colores clásicos de Apple (modelos anteriores)
  "Space Gray",
  "Silver",
  "Gold",
  "Rose Gold",
  "Pacific Blue",
  "Graphite",
  "Sierra Blue",
  "Alpine Green",
  "Midnight",
  "Starlight",
  "Product RED",
  "Purple",
  "Yellow",
  "Blue",
  "Green",
  "Jet Black",
  "Coral",
  "Midnight Green",

  // Colores adicionales de otros productos Apple
  "Space Black",
  "Deep Purple",
  "Dynamic Island",
]

// Constantes para capacidades de almacenamiento
export const STORAGE_CAPACITIES = ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "2TB"]

// Constantes para categorías
export const PRODUCT_CATEGORIES = [
  "iPhones",
  "MacBook",
  "iPad",
  "AirPods",
  "iMac",
  "Mac mini",
  "Mac Studio",
  "Mac Pro",
  "Apple Watch",
  "Accesorios",
]

// Constantes para condiciones
export const PRODUCT_CONDITIONS = ["new", "refurbished"]

// Constantes para secciones de la página principal
export const HOME_SECTIONS = [
  { id: "featured", name: "Productos Destacados" },
  { id: "sale", name: "Ofertas Especiales" },
  { id: "refurbished", name: "Productos Seminuevos" },
  { id: "features", name: "Características" },
]

interface FinancingOption {
  installments: number
  interest: number
}

interface FinancingOptions {
  visa: FinancingOption[]
  naranja: FinancingOption[]
}

export interface StoreConfig {
  id?: number
  storeName: string
  storeDescription: string
  whatsappNumber: string
  dollarRateOfficial: number
  dollarRateBlue: number
  dollarRateMargin: number
  showFeaturedProducts: boolean
  showFinancingOptions: boolean
  showSaleSection: boolean
  showRefurbishedSection: boolean
  sectionsOrder?: string[] // Nueva propiedad para el orden de las secciones
  financingOptions: FinancingOptions
  lastDollarUpdate?: string
  createdAt?: string
  updatedAt?: string
}

// Valores por defecto
const defaultConfig: StoreConfig = {
  storeName: "Karen Bariloche",
  storeDescription: "Tu tienda Apple premium en Bariloche. Productos originales con garantía oficial.",
  whatsappNumber: "5492944808071",
  dollarRateOfficial: 1200,
  dollarRateBlue: 1300,
  dollarRateMargin: 20,
  showFeaturedProducts: true,
  showFinancingOptions: true,
  showSaleSection: true,
  showRefurbishedSection: true,
  sectionsOrder: ["sale", "refurbished", "featured", "features"], // Orden predeterminado
  financingOptions: {
    visa: [
      { installments: 1, interest: 0 },
      { installments: 3, interest: 10 },
      { installments: 6, interest: 20 },
      { installments: 9, interest: 30 },
      { installments: 12, interest: 40 },
    ],
    naranja: [
      { installments: 1, interest: 0 },
      { installments: 3, interest: 15 },
      { installments: 6, interest: 25 },
    ],
  },
  lastDollarUpdate: new Date().toISOString(),
}

// Productos de ejemplo para modo offline
const sampleProducts: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    description: "El iPhone más avanzado con chip A17 Pro y cámara de 48MP",
    price: 999,
    priceARS: 1319000,
    category: "iPhones",
    stock: 5,
    isNew: true,
    isFeatured: true,
    colors: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
    storageCapacity: "128GB",
    hasAppleWarranty: true,
    image: "/images/products/iphones/iphone15-pro-gray.png",
  },
  {
    id: 2,
    name: "MacBook Air M2",
    description: "Ultraportátil con chip M2 y pantalla Liquid Retina de 13.6 pulgadas",
    price: 1199,
    priceARS: 1583000,
    category: "MacBook",
    stock: 3,
    isNew: true,
    colors: ["Silver", "Space Gray", "Starlight", "Midnight"],
    storageCapacity: "256GB",
    hasAppleWarranty: true,
    image: "/images/products/macbook/macbook-air-m2-colors.png",
  },
  {
    id: 3,
    name: "AirPods Pro 2",
    description: "Auriculares inalámbricos con cancelación activa de ruido",
    price: 249,
    priceARS: 329000,
    category: "AirPods",
    stock: 10,
    isNew: true,
    isOnSale: true,
    originalPrice: 279,
    originalPriceARS: 368000,
    discountPercentage: 10,
    colors: ["White"],
    hasAppleWarranty: true,
    image: "/images/products/airpods/airpods-pro-2.png",
  },
]

// Crear el contexto
const StoreContext = createContext<StoreContextType | undefined>(undefined)

// Proveedor del contexto
export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Estado para productos
  const [products, setProducts] = useState<Product[]>([])
  // Estado para configuración
  const [config, setConfig] = useState<StoreConfig>(defaultConfig)
  // Estado de carga
  const [loading, setLoading] = useState(true)
  // Estado de error
  const [error, setError] = useState<string | null>(null)
  // Estado para modo offline
  const [isOffline, setIsOffline] = useState(false)

  // Función para refrescar los datos con mejor manejo de errores - MEMOIZADA
  const refreshData = useCallback(async () => {
    console.log("Store: Iniciando refreshData, loading actual:", loading)
    setLoading(true)
    setError(null)
    setIsOffline(false)

    try {
      console.log("Store: Cargando datos...")

      // Intentar cargar productos con mejor manejo de errores
      let productsData: Product[] = []
      try {
        console.log("Store: Cargando productos...")
        productsData = await getProducts()
        console.log("Store: Productos cargados exitosamente:", productsData.length)
      } catch (productsError) {
        console.warn("Store: Error cargando productos:", productsError)

        // Si es un error de conexión, usar datos de ejemplo
        if (
          (typeof productsError === "object" &&
            productsError !== null &&
            "message" in productsError &&
            typeof (productsError as any).message === "string" &&
            (
              (productsError as any).message.includes("connection") ||
              (productsError as any).message.includes("network") ||
              (productsError as any).message.includes("fetch") ||
              (productsError as any).message.includes("Receiving end does not exist")
            )
          )
        ) {
          console.log("Store: Usando productos de ejemplo debido a problemas de conexión")
          productsData = sampleProducts
          setIsOffline(true)
        } else {
          // Para otros errores, usar array vacío
          productsData = []
        }
      }

      // Intentar cargar configuración
      let configData: StoreConfig | null = null
      try {
        console.log("Store: Cargando configuración...")
        configData = await getConfig()
        console.log("Store: Configuración cargada:", configData ? "Sí" : "No (usando default)")
      } catch (configError) {
        console.warn("Store: Error cargando configuración, usando default:", configError)
        configData = null
      }

      // Procesar datos cargados
      if (configData && !isOffline) {
        setConfig(configData)

        // Recalcular precios ARS para todos los productos
        const updatedProducts = productsData.map((product) => {
          const totalRate = configData.dollarRateBlue + configData.dollarRateMargin
          return {
            ...product,
            priceARS: Math.round(product.price * totalRate),
            ...(product.isOnSale && product.originalPrice
              ? {
                  originalPriceARS: Math.round(product.originalPrice * totalRate),
                }
              : {}),
          }
        })
        setProducts(updatedProducts)
        console.log("Store: Productos actualizados con precios ARS:", updatedProducts.length)
      } else {
        console.log("Store: Usando configuración por defecto")
        setConfig(defaultConfig)
        setProducts(productsData)
      }

      if (isOffline) {
        setError("Modo offline: Mostrando datos de ejemplo. Verifica tu conexión a internet.")
      }

      console.log("Store: Carga de datos completada exitosamente")
    } catch (error) {
      console.error("Store: Error crítico cargando datos:", error)
      setError("Error de conexión. Mostrando datos de ejemplo.")
      setIsOffline(true)
      // En caso de error crítico, usar valores por defecto
      setConfig(defaultConfig)
      setProducts(sampleProducts)
    } finally {
      console.log("Store: Finalizando carga, estableciendo loading = false")
      setLoading(false)
    }
  }, []) // Sin dependencias para evitar loops

  // Cargar datos desde Supabase al iniciar - SOLO UNA VEZ
  useEffect(() => {
    console.log("Store: useEffect inicial ejecutándose")
    refreshData()
  }, [refreshData])

  // Verificar stock bajo periódicamente (cada 24 horas) - Solo si no hay errores
  useEffect(() => {
    // Solo verificar si no estamos cargando, no hay errores y tenemos configuración
    if (!loading && !error && !isOffline && config.whatsappNumber) {
      console.log("Store: Configurando verificación de stock bajo")

      // Verificar al inicio con un pequeño delay
      const timeoutId = setTimeout(() => {
        checkLowStock().catch((err) => {
          console.warn("Error checking low stock (non-critical):", err)
        })
      }, 5000) // 5 segundos de delay para dar tiempo a que se estabilice

      // Configurar verificación periódica
      const interval = setInterval(
        () => {
          checkLowStock().catch((err) => {
            console.warn("Error checking low stock (non-critical):", err)
          })
        },
        24 * 60 * 60 * 1000,
      ) // 24 horas

      return () => {
        clearTimeout(timeoutId)
        clearInterval(interval)
      }
    }
  }, [loading, error, isOffline, config.whatsappNumber])

  // Función para verificar productos con stock bajo con mejor manejo de errores
  const checkLowStock = async () => {
    try {
      // Solo verificar si tenemos un número de WhatsApp configurado y no estamos offline
      if (!config.whatsappNumber || isOffline) {
        return []
      }

      const lowStockProducts = await checkLowStockProducts(config.whatsappNumber)
      return lowStockProducts
    } catch (error) {
      console.warn("Error checking low stock products (non-critical):", error)
      return []
    }
  }

  // Función para obtener la cotización del dólar con mejor manejo de errores
  const fetchDollarRates = async () => {
    try {
      if (isOffline) {
        throw new Error("Offline mode")
      }

      const rates = await getDollarRates()
      const newConfig = {
        ...config,
        dollarRateBlue: rates.blue,
        dollarRateOfficial: rates.official,
        lastDollarUpdate: new Date().toISOString(),
      }
      setConfig(newConfig)

      // Intentar actualizar en la base de datos
      try {
        const result = await updateConfig(newConfig)
        if (result) {
          setConfig(result)
        }
      } catch (updateError) {
        console.warn("Failed to save dollar rates to database:", updateError)
        // Continuar con los valores locales aunque no se puedan guardar
      }
    } catch (error) {
      console.error("Error al obtener la cotización del dólar:", error)
      throw error
    }
  }

  // Función para agregar un producto con mejor manejo de errores
  const addProductHandler = async (product: Omit<Product, "id" | "priceARS">) => {
    try {
      if (isOffline) {
        throw new Error("No se pueden agregar productos en modo offline")
      }

      const newProduct = await addProduct(product)
      if (newProduct) {
        setProducts((prev) => [...prev, newProduct])
      }
    } catch (error) {
      console.error("Error adding product:", error)
      throw error // Re-throw para que el componente pueda manejar el error
    }
  }

  // Función para actualizar un producto con mejor manejo de errores
  const updateProductHandler = async (updatedProduct: Product) => {
    try {
      if (isOffline) {
        throw new Error("No se pueden actualizar productos en modo offline")
      }

      const result = await updateProduct(updatedProduct)
      if (result) {
        setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? result : p)))
      }
    } catch (error) {
      console.error("Error updating product:", error)
      throw error // Re-throw para que el componente pueda manejar el error
    }
  }

  // Función para eliminar un producto con mejor manejo de errores
  const deleteProductHandler = async (id: number) => {
    try {
      if (isOffline) {
        throw new Error("No se pueden eliminar productos en modo offline")
      }

      const success = await deleteProduct(id)
      if (success) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      throw error // Re-throw para que el componente pueda manejar el error
    }
  }

  // Función para actualizar la configuración con mejor manejo de errores
  const updateConfigHandler = async (newConfig: StoreConfig) => {
    try {
      if (isOffline) {
        throw new Error("No se puede actualizar la configuración en modo offline")
      }

      const result = await updateConfig(newConfig)
      if (result) {
        setConfig(result)
      }
    } catch (error) {
      console.error("Error updating config:", error)
      throw error // Re-throw para que el componente pueda manejar el error
    }
  }

  // Función para poner un producto en oferta con mejor manejo de errores
  const setProductOnSaleHandler = async (id: number, isOnSale: boolean, discountPercentage: number) => {
    try {
      if (isOffline) {
        throw new Error("No se pueden modificar ofertas en modo offline")
      }

      const updatedProduct = await setProductOnSale(id, isOnSale, discountPercentage)
      if (updatedProduct) {
        setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)))
      }
    } catch (error) {
      console.error("Error setting product on sale:", error)
      throw error // Re-throw para que el componente pueda manejar el error
    }
  }

  // Función para alternar el estado destacado de un producto con mejor manejo de errores
  const toggleProductFeaturedHandler = async (id: number) => {
    try {
      if (isOffline) {
        throw new Error("No se puede modificar productos destacados en modo offline")
      }

      const updatedProduct = await toggleProductFeatured(id)
      if (updatedProduct) {
        setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)))
      }
    } catch (error) {
      console.error("Error toggling product featured status:", error)
      throw error // Re-throw para que el componente pueda manejar el error
    }
  }

  return (
    <StoreContext.Provider
      value={{
        products,
        config,
        loading,
        error,
        isOffline,
        addProduct: addProductHandler,
        updateProduct: updateProductHandler,
        deleteProduct: deleteProductHandler,
        updateConfig: updateConfigHandler,
        setProductOnSale: setProductOnSaleHandler,
        toggleProductFeatured: toggleProductFeaturedHandler,
        refreshData,
        checkLowStock,
        fetchDollarRates,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

// Hook para usar el contexto
export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore debe ser usado dentro de un StoreProvider")
  }
  return context
}

// Tipo para el contexto
interface StoreContextType {
  products: Product[]
  config: StoreConfig
  loading: boolean
  error: string | null
  isOffline: boolean
  addProduct: (product: Omit<Product, "id" | "priceARS">) => Promise<void>
  updateProduct: (product: Product) => Promise<void>
  deleteProduct: (id: number) => Promise<void>
  updateConfig: (config: StoreConfig) => Promise<void>
  setProductOnSale: (id: number, isOnSale: boolean, discountPercentage: number) => Promise<void>
  toggleProductFeatured: (id: number) => Promise<void>
  refreshData: () => Promise<void>
  checkLowStock: () => Promise<Product[]>
  fetchDollarRates: () => Promise<void>
}