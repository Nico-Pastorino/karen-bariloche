import type { Product } from "@/lib/store"

export function getProductConditionLabel(product: Pick<Product, "isNew" | "condition">): "Nuevo" | "Semi nuevo" {
  if (product.condition === "new") return "Nuevo"
  if (product.condition === "refurbished" || product.condition === "used") return "Semi nuevo"
  return product.isNew ? "Nuevo" : "Semi nuevo"
}

export function buildProductInquiryMessage(product: Product, storeName: string) {
  const conditionLabel = getProductConditionLabel(product)
  return `Hola, estoy interesado en el ${product.name} (${conditionLabel}) que vi en ${storeName}. ¿Me podrías dar más información?`
}
