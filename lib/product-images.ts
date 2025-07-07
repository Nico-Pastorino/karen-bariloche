// Estructura para manejar las imágenes de productos
// En un entorno real, esto se conectaría con un servicio de almacenamiento como Cloudinary, AWS S3, etc.

// Categorías de productos
export const productCategories = ["iPhones", "MacBook", "iPad", "AirPods", "Accesorios"]

// Imágenes predefinidas por categoría
export const defaultProductImages = {
  iPhones: [
    // Imágenes 11

    { id: "iphone-11-pro-white", url: "/images/products/iphones/iphone-11-pro-white.png", name: "iPhone 11 Pro White" },
    
    // Imágenes 12

    { id: "iphone-12-mini-verde", url: "/images/products/iphones/iphone-12-mini-verde.png", name: "iPhone 12 Mini Verde" },
    { id: "iphone-12-pro-black", url: "/images/products/iphones/iphone-12-pro-black.png", name: "iPhone 12 Pro Black" },
    { id: "iphone-12-todos", url: "/images/products/iphones/iphone-12-todos.png", name: "iPhone 12 Todos" },

    // Imágenes 13

    { id: "iphone-13-negro", url: "/images/products/iphones/iphone-13-negro.png", name: "iPhone 13 Negro" },
    { id: "iphone-13-pink", url: "/images/products/iphones/iphone-13-pink.png", name: "iPhone 13 Pink" },
    { id: "iphone-13-white", url: "/images/products/iphones/iphone-13-white.png", name: "iPhone 13 White" },

    // Imágenes 14

    { id: "iphone-14-blue", url: "/images/products/iphones/iphone-14-blue.png", name: "iPhone 14 Blue" },
    { id: "iphone-14-negro", url: "/images/products/iphones/iphone-14-negro.png", name: "iPhone 14 Negro" },
    { id: "iphone-14-pink", url: "/images/products/iphones/iphone-14-pink.png", name: "iPhone 14 Pink" },
    { id: "iphone-14-todos", url: "/images/products/iphones/iphone-14-todos.png", name: "iPhone 14 Todos" },
    { id: "iphone-14-pro-purple", url: "/images/products/iphones/iphone-14-pro-purple.png", name: "iPhone 14 Pro Purple" },
    { id: "iphone-14-pro-todos", url: "/images/products/iphones/iphone-14-pro-todos.png", name: "iPhone 14 Pro Todos" },

    // Imágenes 15

    { id: "iphone-15-negro", url: "/images/products/iphones/iphone-15-negro.png", name: "iPhone 15 Negro" },
    { id: "iphone-15-pro-todos", url: "/images/products/iphones/iphone-15-pro-todos.png", name: "iPhone 15 Pro Todos" },
    { id: "iphone-15-pro-titanium-black", url: "/images/products/iphones/iphone-15-pro-titanium-black.png", name: "iPhone 15 Pro Titanium Black" },
    { id: "iphone-15-pro-titanium-natural", url: "/images/products/iphones/iphone-15-pro-titanium-natural.png", name: "iPhone 15 Pro Titanium Natural" },

    // Imágenes 16

    { id: "iphone-16-todos", url: "/images/products/iphones/iphone-16-todos.png", name: "iPhone 16 Todos" },
    { id: "iphone-16e-todos", url: "/images/products/iphones/iphone-16e-todos.png", name: "iPhone 16e Todos" },
    { id: "iphone-16-pro-todos", url: "/images/products/iphones/iphone-16-pro-todos.png", name: "iPhone 16 Pro Todos" },
    { id: "iphone-16-pro-white", url: "/images/products/iphones/iphone-16-pro-white.png", name: "iPhone 16 Pro White" },

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