// Estructura para manejar las imágenes de productos
// En un entorno real, esto se conectaría con un servicio de almacenamiento como Cloudinary, AWS S3, etc.

// Categorías de productos
export const productCategories = ["iPhones", "MacBook", "iPad", "AirPods", "Accesorios"]

// Imágenes predefinidas por categoría
export const defaultProductImages = {
  iPhones: [
    // Imágenes originales
    { id: "iphone15-pro-black", url: "/images/products/iphones/iphone15-pro-black.png", name: "iPhone 15 Pro Black" },
    { id: "iphone15-pro-gray", url: "/images/products/iphones/iphone15-pro-gray.png", name: "iPhone 15 Pro Gray" },
    {
      id: "iphone14-pro-purple",
      url: "/images/products/iphones/iphone14-pro-purple.png",
      name: "iPhone 14 Pro Purple",
    },
    { id: "iphone14-blue", url: "/images/products/iphones/iphone14-blue.jpeg", name: "iPhone 14 Blue" },
    { id: "iphone13-pink", url: "/images/products/iphones/iphone13-pink.png", name: "iPhone 13 Pink" },
    { id: "iphone13-black", url: "/images/products/iphones/iphone13-black.png", name: "iPhone 13 Black" },
    { id: "iphone13-white", url: "/images/products/iphones/iphone13-white.png", name: "iPhone 13 White" },
    { id: "iphone12-red", url: "/images/products/iphones/iphone12-red.png", name: "iPhone 12 Red" },
    {
      id: "iphone12-mini-green",
      url: "/images/products/iphones/iphone12-mini-green.png",
      name: "iPhone 12 Mini Green",
    },
    { id: "iphone-colors", url: "/images/products/iphones/iphone-colors.png", name: "iPhone Color Options" },

    // Imágenes agregadas previamente
    { id: "iphone14-pink", url: "/images/products/iphones/iphone14-pink.png", name: "iPhone 14 Rosa" },
    { id: "iphone-14-negro", url: "/images/products/iphones/iphone-14-negro.png", name: "iPhone 14 Negro" },
    {
      id: "iphone-14-pro-colores",
      url: "/images/products/iphones/iphone-14-pro-colores.png",
      name: "iPhone 14 Pro Colores",
    },
    { id: "iphone-15-negro", url: "/images/products/iphones/iphone-15-negro.png", name: "iPhone 15 Negro" },
    { id: "iphone_15_colores", url: "/images/products/iphones/iphone_15_colores.png", name: "iPhone 15 Colores" },
    { id: "iphone-16-pro-negro", url: "/images/products/iphones/iphone-16-pro-negro.png", name: "iPhone 16 Pro Negro" },

    // Nuevas imágenes (asegurando que las rutas sean correctas)
    {
      id: "iphone-16-pro-white",
      url: "/images/products/iphones/iphone-16-pro-white.png",
      name: "iPhone 16 Pro Blanco",
    },
    { id: "iphones-15-pro", url: "/images/products/iphones/iphones-15-pro.png", name: "iPhone 15 Pro Colores" },
    {
      id: "iphones-15-pro-colores",
      url: "/images/products/iphones/iphones-15-pro-colores.png",
      name: "iPhone 15 Pro Todos los Colores",
    },
    {
      id: "iphones-16-colores",
      url: "/images/products/iphones/iphones-16-colores.png",
      name: "iPhone 16 Todos los Colores",
    },
    {
      id: "iphone-15-titanio-natural",
      url: "/images/products/iphones/iphone-15-titanio-natural.png",
      name: "iPhone 15 Titanio Natural",
    },
    {
      id: "iphone-16-pro-desert-titanium",
      url: "/images/products/iphones/iphone-16-pro-desert-titanium.png",
      name: "iPhone 16 Pro Titanio Desierto",
    },

    // Nuevas imágenes agregadas ahora
    {
      id: "iphone-16e-colors",
      url: "/images/products/iphones/iphone-16e-colors.png",
      name: "iPhone 16E Negro y Blanco",
    },
    {
      id: "iphone-12-todos",
      url: "/images/products/iphones/iphone-12-todos.png",
      name: "iPhone 12 Todos los Colores",
    },
    {
      id: "iphone-14-plus-red",
      url: "/images/products/iphones/iphone-14-plus-red.png",
      name: "iPhone 14 Plus Rojo",
    },
  ],
  MacBook: [
    { id: "imac-24-blue", url: "/images/products/macbook/imac-24-blue.png", name: "iMac 24 pulgadas Azul" },
    { id: "mac-mini-m2", url: "/images/products/macbook/mac-mini-m2.png", name: "Mac Mini M2" },
    { id: "macbook-m3-pro", url: "/images/products/macbook/macbook-m3-pro.png", name: "MacBook Pro M3" },
    {
      id: "macbook-air-m1-silver",
      url: "/images/products/macbook/macbook-air-m1-silver.png",
      name: "MacBook Air M1 Plata",
    },
    {
      id: "macbook-air-m2-colors",
      url: "/images/products/macbook/macbook-air-m2-colors.png",
      name: "MacBook Air M2 Colores",
    },
    {
      id: "macbook-m4",
      url: "/images/products/macbook/macbook-M4.png",
      name: "MacBook Air M4",
    },
  ],
  iPad: [
    { id: "ipad-air-m1-gris", url: "/images/products/ipad/IPAD-AIR-M1-gris.png", name: "iPad Air M1 Gris Espacial" },
    { id: "ipad-pro-m1", url: "/images/products/ipad/IPAD-PRO-M1.png", name: "iPad Pro M1 Colores" },
    { id: "ipad-mini-colores", url: "/images/products/ipad/ipad-mini-colores.png", name: "iPad Mini Colores" },
    { id: "ipad-pro-m2", url: "/images/products/ipad/iPad-Pro-M2.png", name: "iPad Pro M2 Gris Espacial" },
    { id: "ipad-pro-m4", url: "/images/products/ipad/ipad-pro-M4.png", name: "iPad Pro M4 Colores" },
  ],
  AirPods: [
    { id: "airpods-pro-2", url: "/images/products/airpods/airpods-pro-2.png", name: "AirPods Pro 2" },
    { id: "airpods-3", url: "/images/products/airpods/airpods-3.png", name: "AirPods 3" },
    { id: "airpods-2", url: "/images/products/airpods/airpods-2.png", name: "AirPods 2" },
  ],
  Accesorios: [
    {
      id: "apple-watch-se-2nd-gen",
      url: "/images/products/accesorios/apple-watch-se-2nd-gen.png",
      name: "Apple Watch SE 2ª Gen",
    },
    { id: "airpods-max-white", url: "/images/products/accesorios/airpods-max-white.png", name: "AirPods Max Blanco" },
    { id: "airtag-white", url: "/images/products/accesorios/airtag-white.png", name: "AirTag Blanco" },
    { id: "pencil", url: "/images/products/accesorios/pencil.png", name: "Apple Pencil" },
  ],
}

// Función para obtener todas las imágenes de productos
export function getAllProductImages() {
  const allImages: { id: string; url: string; name: string; category: string }[] = []

  Object.entries(defaultProductImages).forEach(([category, images]) => {
    images.forEach((image) => {
      allImages.push({
        ...image,
        category,
      })
    })
  })

  return allImages
}

// Función para obtener imágenes por categoría
export function getProductImagesByCategory(category: string) {
  if (category in defaultProductImages) {
    return defaultProductImages[category as keyof typeof defaultProductImages]
  }
  return []
}

// Función para obtener una imagen por su ID
export function getProductImageById(id: string) {
  const allImages = getAllProductImages()
  return allImages.find((image) => image.id === id)
}