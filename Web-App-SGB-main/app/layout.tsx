import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import { DataProvider } from "@/contexts/data-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sistema de Gestión de Bibliotecas",
  description: "Administra autores, libros y bibliotecas de forma eficiente",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <DataProvider>{children}</DataProvider>
          <Toaster />
        </Suspense>
      </body>
    </html>
  )
}
