"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { products } = useStore()

  // Función para manejar la búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Redirigir a la página de productos con el término de búsqueda
      router.push(`/productos?search=${encodeURIComponent(searchQuery.trim())}`)
      // Limpiar el campo de búsqueda y cerrar menú móvil
      setSearchQuery("")
      setIsMenuOpen(false)
    }
  }

  // Función para manejar Enter en el input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e as any)
    }
  }

  // Función para búsqueda en tiempo real (opcional)
  const getSearchSuggestions = () => {
    if (!searchQuery.trim() || searchQuery.length < 2) return []

    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .slice(0, 5) // Mostrar solo 5 sugerencias
  }

  const suggestions = getSearchSuggestions()

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/kb-logo-new.png"
              alt="Karen Bariloche"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="font-bold text-xl text-gray-800">Karen Bariloche</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Inicio
            </Link>
            <Link href="/productos" className="text-gray-600 hover:text-gray-900 transition-colors">
              Productos
            </Link>
            <Link href="/contacto" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contacto
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 w-64"
              />

              {/* Sugerencias de búsqueda */}
              {suggestions.length > 0 && searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-50">
                  {suggestions.map((product) => (
                    <Link
                      key={product.id}
                      href={`/productos/${product.id}`}
                      className="block px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      onClick={() => setSearchQuery("")}
                    >
                      <div className="flex items-center space-x-3">
                        <Image
                          src={product.image || "/placeholder.svg?height=32&width=32"}
                          alt={product.name}
                          width={32}
                          height={32}
                          className="rounded object-contain"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleSearch({ preventDefault: () => {} } as any)
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Ver todos los resultados para "{searchQuery}"
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 w-full"
                />
              </div>
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/productos"
                className="text-gray-600 hover:text-gray-900 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              <Link
                href="/contacto"
                className="text-gray-600 hover:text-gray-900 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}