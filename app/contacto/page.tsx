import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import Link from "next/link"

export default function ContactPage() {
  const whatsappNumber = "5492944808071" // Número directo para evitar dependencia del store

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contacto</h1>
            <p className="text-xl text-gray-600">
              Estamos aquí para ayudarte. Contáctanos por cualquier consulta sobre nuestros productos Apple.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Información de contacto */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    WhatsApp
                  </CardTitle>
                  <CardDescription>La forma más rápida de contactarnos</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold mb-4">+{whatsappNumber}</p>
                  <Link
                    href={`https://wa.me/${whatsappNumber}?text=Hola! Me interesa conocer más sobre sus productos Apple.`}
                    target="_blank"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Enviar mensaje
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <li className="flex items-center space-x-2">
                   <Mail className="h-4 w-4 text-gray-400" />
                    <a
                     href="mailto:barilochekaren@gmail.com"
                     className="text-gray-300 hover:text-white transition-colors text-sm underline"
                        >
                         barilochekaren@gmail.com
                    </a>
                  </li>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Ubicación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">Bariloche, Argentina</p>
                  <p className="text-gray-600 mt-2">Realizamos entregas en toda la ciudad y envíos a todo el país.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Horarios de atención
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Lunes a Viernes:</span>
                      <span className="font-semibold">9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sábados:</span>
                      <span className="font-semibold">9:00 - 13:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domingos:</span>
                      <span className="text-gray-500">Cerrado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Información adicional */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>¿Por qué elegirnos?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Productos Apple originales con garantía oficial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Atención personalizada y asesoramiento especializado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Financiación disponible con tarjetas de crédito</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Envíos seguros a todo el país</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Soporte post-venta y servicio técnico</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preguntas frecuentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-1">¿Los productos tienen garantía?</h4>
                      <p className="text-gray-600 text-sm">
                        Sí, todos nuestros productos Apple cuentan con garantía oficial de 1 año.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">¿Hacen envíos?</h4>
                      <p className="text-gray-600 text-sm">
                        Realizamos envíos a todo el país a través de correo seguro.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">¿Aceptan tarjetas de crédito?</h4>
                      <p className="text-gray-600 text-sm">
                        Sí, aceptamos todas las tarjetas de crédito con financiación disponible.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}