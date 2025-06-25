"use server"

import { revalidatePath } from "next/cache"
import { supabase, isSupabaseAvailable } from "./supabase"
import type { Product, StoreConfig } from "./store"

// Convertir de snake_case (DB) a camelCase (Frontend)
function snakeToCamel(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel)
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    acc[camelKey] = snakeToCamel(obj[key])
    return acc
  }, {} as any)
}

// Convertir de camelCase (Frontend) a snake_case (DB) - MEJORADO
function camelToSnake(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(camelToSnake)
  }

  // Mapeo manual para campos problemáticos
  const fieldMapping: Record<string, string> = {
    priceARS: "price_ars",
    originalPriceARS: "original_price_ars",
    isFeatured: "is_featured",
    isNew: "is_new",
    isOnSale: "is_on_sale",
    hasAppleWarranty: "has_apple_warranty",
    batteryPercentage: "battery_percentage",
    storageCapacity: "storage_capacity",
    lowStockThreshold: "low_stock_threshold",
    lastStockAlert: "last_stock_alert",
    discountPercentage: "discount_percentage",
    originalPrice: "original_price",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }

  return Object.keys(obj).reduce((acc, key) => {
    // Usar mapeo manual si existe, sino usar conversión automática
    const snakeKey = fieldMapping[key] || key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    acc[snakeKey] = camelToSnake(obj[key])
    return acc
  }, {} as any)
}

// Acciones para productos con mejor manejo de errores
export async function getProducts(): Promise<Product[]> {
  try {
    if (!isSupabaseAvailable()) {
      throw new Error("Supabase no está disponible - conexión no establecida")
    }

    console.log("Fetching products from Supabase...")

    const { data, error } = await supabase!.from("products").select("*").order("id", { ascending: true })

    if (error) {
      console.error("Supabase error fetching products:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    if (!data) {
      console.warn("No products data returned from Supabase")
      return []
    }

    console.log(`Successfully fetched ${data.length} products`)

    // Asegurarse de que todos los productos tengan un precio en ARS
    let configData = null
    try {
      const configResult = await supabase!.from("config").select("*").limit(1).single()
      if (configResult.data) {
        configData = configResult.data
      }
    } catch (configError) {
      console.warn("Could not fetch config for price calculation, using defaults:", configError)
    }

    const dollarRate = configData?.dollar_rate_blue || 1300
    const dollarMargin = configData?.dollar_rate_margin || 20
    const totalRate = dollarRate + dollarMargin

    const productsWithARS = data.map((product) => {
      if (!product.price_ars || product.price_ars === 0) {
        product.price_ars = Math.round(product.price * totalRate)
      }
      return product
    })

    const convertedProducts = productsWithARS.map((product) => snakeToCamel(product)) as Product[]
    console.log(`Converted ${convertedProducts.length} products successfully`)

    return convertedProducts
  } catch (error) {
    console.error("Exception in getProducts:", error)

    // Si es un error de conexión, lanzar error específico
    if (
      error.message?.includes("connection") ||
      error.message?.includes("network") ||
      error.message?.includes("fetch") ||
      error.message?.includes("Receiving end does not exist") ||
      error.message?.includes("Supabase no está disponible")
    ) {
      throw new Error("Error de conexión con la base de datos")
    }

    // Para otros errores, re-throw
    throw error
  }
}

// En la función addProduct, verificar disponibilidad de Supabase
export async function addProduct(product: Omit<Product, "id" | "priceARS">): Promise<Product | null> {
  try {
    if (!isSupabaseAvailable()) {
      throw new Error("No se puede agregar producto: Supabase no está disponible")
    }

    // Obtener la configuración actual para usar la tasa de dólar correcta
    let configData = null
    try {
      const configResult = await supabase!.from("config").select("*").limit(1).single()
      configData = configResult.data
    } catch (configError) {
      console.warn("Could not fetch config, using defaults:", configError)
    }

    const dollarRate = configData?.dollar_rate_blue || 1300
    const dollarMargin = configData?.dollar_rate_margin || 20
    const totalRate = dollarRate + dollarMargin

    // Crear objeto con campos mapeados manualmente
    const productData = {
      name: product.name,
      description: product.description,
      price: product.price,
      price_ars: Math.round(product.price * totalRate),
      category: product.category,
      stock: product.stock || 0,
      is_new: product.isNew,
      is_featured: product.isFeatured || false,
      image: product.image,
      condition: product.condition,
      battery_percentage: product.batteryPercentage,
      color: product.color,
      colors: product.colors ? JSON.stringify(product.colors) : null, // Guardar como JSON string
      storage_capacity: product.storageCapacity,
      low_stock_threshold: product.lowStockThreshold || 5,
      has_apple_warranty: product.hasAppleWarranty || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase!.from("products").insert(productData).select().single()

    if (error) {
      console.error("Error adding product:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    revalidatePath("/admin/dashboard")
    revalidatePath("/productos")
    revalidatePath("/")

    return snakeToCamel(data) as Product
  } catch (error) {
    console.error("Exception in addProduct:", error)
    throw error
  }
}

// Resto de funciones con verificación similar...
export async function updateProduct(product: Product): Promise<Product | null> {
  try {
    if (!isSupabaseAvailable()) {
      throw new Error("No se puede actualizar producto: Supabase no está disponible")
    }

    // Obtener la configuración actual para usar la tasa de dólar correcta
    let configData = null
    try {
      const configResult = await supabase!.from("config").select("*").limit(1).single()
      configData = configResult.data
    } catch (configError) {
      console.warn("Could not fetch config, using defaults:", configError)
    }

    const dollarRate = configData?.dollar_rate_blue || 1300
    const dollarMargin = configData?.dollar_rate_margin || 20
    const totalRate = dollarRate + dollarMargin

    // Recalcular siempre el precio en ARS basado en la configuración actual
    const calculatedPriceARS = Math.round(product.price * totalRate)

    // Crear objeto con campos mapeados manualmente
    const productData = {
      name: product.name,
      description: product.description,
      price: product.price,
      price_ars: calculatedPriceARS,
      category: product.category,
      stock: product.stock || 0,
      is_new: product.isNew,
      is_featured: product.isFeatured || false,
      is_on_sale: product.isOnSale || false,
      original_price: product.originalPrice,
      original_price_ars: product.originalPriceARS,
      discount_percentage: product.discountPercentage,
      image: product.image,
      condition: product.condition,
      battery_percentage: product.batteryPercentage,
      color: product.color,
      colors: product.colors ? JSON.stringify(product.colors) : null, // Guardar como JSON string
      storage_capacity: product.storageCapacity,
      low_stock_threshold: product.lowStockThreshold || 5,
      last_stock_alert: product.lastStockAlert,
      has_apple_warranty: product.hasAppleWarranty || false,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase!.from("products").update(productData).eq("id", product.id).select().single()

    if (error) {
      console.error("Error updating product:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    revalidatePath("/admin/dashboard")
    revalidatePath(`/productos/${product.id}`)
    revalidatePath("/productos")
    revalidatePath("/")

    return snakeToCamel(data) as Product
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

export async function deleteProduct(id: number): Promise<boolean> {
  try {
    if (!isSupabaseAvailable()) {
      throw new Error("No se puede eliminar producto: Supabase no está disponible")
    }

    const { error } = await supabase!.from("products").delete().eq("id", id)

    if (error) {
      console.error("Error deleting product:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    revalidatePath("/admin/dashboard")
    revalidatePath("/productos")
    revalidatePath("/")

    return true
  } catch (error) {
    console.error("Exception in deleteProduct:", error)
    throw error
  }
}

export async function setProductOnSale(
  id: number,
  isOnSale: boolean,
  discountPercentage: number,
): Promise<Product | null> {
  try {
    if (!isSupabaseAvailable()) {
      throw new Error("No se puede modificar oferta: Supabase no está disponible")
    }

    // Primero obtenemos el producto actual
    const { data: product, error: fetchError } = await supabase!.from("products").select("*").eq("id", id).single()

    if (fetchError) {
      console.error("Error fetching product for sale update:", fetchError)
      throw new Error(`Database error: ${fetchError.message}`)
    }

    let updateData: any = {}

    if (isOnSale) {
      // Si se pone en oferta
      const originalPrice = product.price
      const price = Math.round(originalPrice * (1 - discountPercentage / 100))

      // Obtener la configuración actual para usar la tasa correcta
      let configData = null
      try {
        const configResult = await supabase!.from("config").select("*").limit(1).single()
        configData = configResult.data
      } catch (configError) {
        console.warn("Could not fetch config, using defaults:", configError)
      }

      const dollarRate = configData?.dollar_rate_blue || 1300
      const dollarMargin = configData?.dollar_rate_margin || 20
      const currentTotalRate = dollarRate + dollarMargin
      const priceArs = Math.round(price * currentTotalRate)

      const originalPriceArs = product.price_ars

      updateData = {
        is_on_sale: true,
        original_price: originalPrice,
        original_price_ars: originalPriceArs,
        price: price,
        price_ars: priceArs,
        discount_percentage: discountPercentage,
        updated_at: new Date().toISOString(),
      }
    } else {
      // Si se quita de oferta
      updateData = {
        is_on_sale: false,
        price: product.original_price || product.price,
        price_ars: product.original_price_ars || product.price_ars,
        original_price: null,
        original_price_ars: null,
        discount_percentage: null,
        updated_at: new Date().toISOString(),
      }
    }

    const { data, error } = await supabase!.from("products").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating product sale status:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    revalidatePath("/admin/dashboard")
    revalidatePath(`/productos/${id}`)
    revalidatePath("/productos")
    revalidatePath("/")

    return snakeToCamel(data) as Product
  } catch (error) {
    console.error("Exception in setProductOnSale:", error)
    throw error
  }
}

// Nueva función para alternar el estado destacado de un producto
export async function toggleProductFeatured(id: number): Promise<Product | null> {
  try {
    if (!isSupabaseAvailable()) {
      throw new Error("No se puede modificar producto destacado: Supabase no está disponible")
    }

    // Primero obtenemos el producto actual
    const { data: product, error: fetchError } = await supabase!.from("products").select("*").eq("id", id).single()

    if (fetchError) {
      console.error("Error fetching product for featured toggle:", fetchError)
      throw new Error(`Database error: ${fetchError.message}`)
    }

    // Alternar el estado destacado
    const newFeaturedStatus = !product.is_featured

    const { data, error } = await supabase!
      .from("products")
      .update({
        is_featured: newFeaturedStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error toggling product featured status:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    revalidatePath("/admin/dashboard")
    revalidatePath("/productos")
    revalidatePath("/")

    return snakeToCamel(data) as Product
  } catch (error) {
    console.error("Exception in toggleProductFeatured:", error)
    throw error
  }
}

// Nueva función para verificar productos con stock bajo - CORREGIDA
export async function checkLowStockProducts(whatsappNumber: string): Promise<Product[]> {
  try {
    if (!isSupabaseAvailable()) {
      console.warn("Supabase no disponible para verificar stock bajo")
      return []
    }

    // Obtener todos los productos primero
    const { data: productsData, error } = await supabase!.from("products").select("*")

    if (error) {
      console.error("Error checking low stock products:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    if (!productsData || productsData.length === 0) {
      return []
    }

    // Filtrar productos con stock bajo y que no hayan tenido alerta en las últimas 24 horas
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const lowStockProducts = productsData.filter((product) => {
      const isLowStock = product.stock < (product.low_stock_threshold || 5)
      const noRecentAlert = !product.last_stock_alert || new Date(product.last_stock_alert) < twentyFourHoursAgo
      return isLowStock && noRecentAlert
    })

    if (lowStockProducts.length === 0) {
      return []
    }

    // Actualizar la fecha de la última alerta para estos productos
    const now = new Date().toISOString()
    const updates = lowStockProducts.map((product) =>
      supabase!.from("products").update({ last_stock_alert: now }).eq("id", product.id),
    )

    // Ejecutar las actualizaciones pero no fallar si alguna falla
    try {
      await Promise.all(updates)
    } catch (updateError) {
      console.error("Error updating stock alert timestamps:", updateError)
      // Continuar aunque falle la actualización
    }

    // Enviar alerta por WhatsApp si hay un número configurado
    if (whatsappNumber && lowStockProducts.length > 0) {
      try {
        await sendLowStockAlert(lowStockProducts, whatsappNumber)
      } catch (alertError) {
        console.error("Error sending WhatsApp alert:", alertError)
        // Continuar aunque falle el envío de alerta
      }
    }

    return lowStockProducts.map((product) => snakeToCamel(product)) as Product[]
  } catch (error) {
    console.error("Exception in checkLowStockProducts:", error)
    return []
  }
}

// Función para enviar alerta de stock bajo por WhatsApp
async function sendLowStockAlert(products: any[], whatsappNumber: string): Promise<void> {
  try {
    // Crear mensaje con los productos con stock bajo
    let message = "🚨 *ALERTA DE STOCK BAJO* 🚨\n\n"
    message += "Los siguientes productos están por debajo del umbral de stock:\n\n"

    products.forEach((product) => {
      message += `• *${product.name}*\n`
      message += `  - Stock actual: ${product.stock}\n`
      message += `  - Umbral: ${product.low_stock_threshold || 5}\n`
      message += `  - ID: ${product.id}\n\n`
    })

    message += "Por favor, actualice el inventario o elimine estos productos."

    // Crear URL de WhatsApp con el mensaje
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`

    // En un entorno de servidor real, aquí se podría usar una API para enviar el mensaje
    // Por ahora, solo registramos la URL en la consola
    console.log("WhatsApp alert URL:", whatsappUrl)

    // Opcionalmente, se podría implementar una API real para enviar mensajes
    // await fetch('https://your-whatsapp-api-endpoint', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ to: whatsappNumber, message })
    // })
  } catch (error) {
    console.error("Error sending WhatsApp alert:", error)
  }
}

// Acciones para configuración con mejor manejo de errores
export async function getConfig(): Promise<StoreConfig | null> {
  try {
    if (!isSupabaseAvailable()) {
      console.warn("Supabase no disponible para cargar configuración")
      return null
    }

    console.log("Fetching config from Supabase...")

    const { data, error } = await supabase!
      .from("config")
      .select("*")
      .order("id", { ascending: true })
      .limit(1)
      .single()

    if (error) {
      // Si no hay configuración, no es un error crítico
      if (error.code === "PGRST116") {
        console.log("No config found in database")
        return null
      }
      console.error("Supabase error fetching config:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    if (!data) {
      console.warn("No config data returned from Supabase")
      return null
    }

    console.log("Config loaded successfully")
    return snakeToCamel(data) as StoreConfig
  } catch (error) {
    console.error("Exception in getConfig:", error)

    // Si es un error de conexión, devolver null
    if (
      error.message?.includes("connection") ||
      error.message?.includes("network") ||
      error.message?.includes("fetch") ||
      error.message?.includes("Receiving end does not exist")
    ) {
      console.warn("Connection error in getConfig, returning null")
      return null
    }

    // Para otros errores, re-throw
    throw error
  }
}

export async function updateConfig(config: StoreConfig): Promise<StoreConfig | null> {
  try {
    if (!isSupabaseAvailable()) {
      throw new Error("No se puede actualizar configuración: Supabase no está disponible")
    }

    const configData = camelToSnake({
      ...config,
      last_dollar_update: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    // Verificar si ya existe una configuración
    const { data: existingConfig, error: fetchError } = await supabase!.from("config").select("id").limit(1).single()

    let result

    if (existingConfig && !fetchError) {
      // Actualizar configuración existente
      result = await supabase!.from("config").update(configData).eq("id", existingConfig.id).select().single()
    } else {
      // Crear nueva configuración
      result = await supabase!
        .from("config")
        .insert({
          ...configData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()
    }

    if (result.error) {
      console.error("Error updating config:", result.error)
      throw new Error(`Database error: ${result.error.message}`)
    }

    // Actualizar precios de productos basados en la nueva tasa de dólar
    try {
      await updateProductPrices(config.dollarRateBlue, config.dollarRateMargin)
    } catch (priceUpdateError) {
      console.warn("Could not update product prices:", priceUpdateError)
      // No fallar la operación principal si falla la actualización de precios
    }

    revalidatePath("/admin/dashboard")
    revalidatePath("/productos")
    revalidatePath("/")

    return snakeToCamel(result.data) as StoreConfig
  } catch (error) {
    console.error("Exception in updateConfig:", error)
    throw error
  }
}

// Mejorar la función updateProductPrices para asegurar que los precios se calculen correctamente
async function updateProductPrices(dollarRateBlue: number, dollarRateMargin: number): Promise<void> {
  try {
    if (!isSupabaseAvailable()) {
      console.warn("Supabase no disponible para actualizar precios")
      return
    }

    const { data: products, error } = await supabase!.from("products").select("*")

    if (error) {
      console.error("Error fetching products for price update:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    if (!products || products.length === 0) {
      console.log("No products to update prices for")
      return
    }

    const totalRate = dollarRateBlue + dollarRateMargin

    const updates = products.map((product) => {
      // Calcular el precio en ARS basado en el precio en USD
      const priceArs = Math.round(product.price * totalRate)

      // Si el producto está en oferta, también actualizar el precio original en ARS
      let originalPriceArs = null
      if (product.is_on_sale && product.original_price) {
        originalPriceArs = Math.round(product.original_price * totalRate)
      }

      return supabase!
        .from("products")
        .update({
          price_ars: priceArs,
          original_price_ars: originalPriceArs,
          updated_at: new Date().toISOString(),
        })
        .eq("id", product.id)
    })

    await Promise.all(updates)

    // Revalidar rutas para reflejar los cambios
    revalidatePath("/admin/dashboard")
    revalidatePath("/productos")
    revalidatePath("/")
  } catch (error) {
    console.error("Error updating product prices:", error)
    throw error
  }
}