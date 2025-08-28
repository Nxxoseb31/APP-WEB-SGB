"use client"
import { Button } from "@/components/ui/button"

interface NavigationTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  const tabs = [
    { id: "autores", label: "Autores" },
    { id: "libros", label: "Libros" },
    { id: "bibliotecas", label: "Bibliotecas" },
  ]

  return (
    <div className="flex justify-center space-x-1 bg-gray-50 p-1 rounded-lg max-w-md mx-auto">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 ${
            activeTab === tab.id ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  )
}
