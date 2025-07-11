"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, Clock, Instagram } from "lucide-react"
import { useStore } from "@/lib/store"
import { useEffect, useState } from "react"

// Configuración por defecto como fallback
const defaultConfig = {
  whatsappNumber: "5492944808071",
}

export function Footer() {
  // Intentar usar el store, pero con fallback si no está disponible
  const [config, setConfig] = useState(defaultConfig)

  useEffect(() => {
    try {
      const store = useStore()
      setConfig(store.config)
    } catch (error) {
      // Si el store no está disponible, usar la configuración por defecto
      console.warn("Store not available in Footer, using default config")
    }
  }, [])

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/kb-logo-new.png"
                alt="Karen Bariloche"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-bold text-xl">Karen Bariloche</span>
            </div>
            <p className="text-gray-300 text-sm">
              Tu tienda Apple premium en Bariloche. Productos originales con garantía oficial.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/productos" className="text-gray-300 hover:text-white transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-gray-300 hover:text-white transition-colors">
                  Administración
                </Link>
              </li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">Bariloche, Argentina</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <Link
                  href={`https://wa.me/${config.whatsappNumber}`}
                  target="_blank"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  +{config.whatsappNumber}
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <a
                  href="mailto:barilochekaren@gmail.com"
                  className="text-gray-300 hover:text-white transition-colors text-sm underline"
                >
                  barilochekaren@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Instagram className="h-4 w-4 text-gray-400" />
                <Link
                  href="https://www.instagram.com/karen.bariloche?igsh=MWswZ2Z1MHA5Y3Iybg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  @karen.bariloche
                </Link>
              </li>
            </ul>
          </div>

          {/* Horarios */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Horarios</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">Lun - Vie: 9:00 - 18:00</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">Sáb: 9:00 - 13:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">© 2024 Karen Bariloche. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}