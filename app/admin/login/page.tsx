"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Lock, AlertCircle, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulación de autenticación con las credenciales específicas
    setTimeout(() => {
      if (username === "Karenborrego" && password === "270790lalo") {
        // Guardar estado de autenticación en localStorage
        localStorage.setItem("adminAuthenticated", "true")
        localStorage.setItem("adminUser", username)
        router.push("/admin")
      } else {
        setError("Usuario o contraseña incorrectos")
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md border-gray-200 shadow-xl rounded-xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-gradient-to-r from-gray-800 to-black p-4 shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl text-center font-bold bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
            Panel de Administración
          </CardTitle>
          <CardDescription className="text-center text-gray-600 text-base">
            Acceso exclusivo para administradores de Karen Bariloche
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50/80 backdrop-blur-sm">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-3">
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
                Usuario
              </Label>
              <Input
                id="username"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-lg border-gray-300 h-12 text-base focus:ring-2 focus:ring-black focus:border-black transition-all"
                required
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Contraseña
                </Label>
                <Link href="#" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg border-gray-300 h-12 text-base pr-12 focus:ring-2 focus:ring-black focus:border-black transition-all"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex h-5 items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black focus:ring-2"
                />
              </div>
              <Label htmlFor="remember" className="text-sm font-normal text-gray-600">
                Mantener sesión iniciada
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 text-white rounded-lg h-12 text-base font-semibold shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verificando credenciales...</span>
                </div>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
            <div className="text-center text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-900 hover:underline transition-colors">
                ← Volver a la tienda
              </Link>
            </div>
          </CardFooter>
        </form>
        <div className="p-6 pt-0 text-center border-t border-gray-100 mt-4">
          <div className="flex justify-center mb-3">
            <Image
              src="/images/kb-logo-new.png"
              alt="Karen Bariloche"
              width={45}
              height={45}
              className="rounded-full shadow-sm"
            />
          </div>
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Karen Bariloche - Acceso Administrativo</p>
        </div>
      </Card>
    </div>
  )
}