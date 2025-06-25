import type React from "react"

interface ProductDetailCardProps {
  productName: string
  productDescription: string
  productPrice: number
  imageUrl: string
}

const ProductDetailCard: React.FC<ProductDetailCardProps> = ({
  productName,
  productDescription,
  productPrice,
  imageUrl,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img className="w-full h-48 object-cover" src={imageUrl || "/placeholder.svg"} alt={productName} />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{productName}</h2>
        <p className="text-gray-700 text-base mb-2">{productDescription}</p>
        <p className="text-gray-900 font-bold text-lg">${productPrice.toFixed(2)}</p>
      </div>
    </div>
  )
}

export default ProductDetailCard