"use client"
import { Button } from "@/components/ui/button"

interface NavigationTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  const tabs = [
    { id: "authors", label: "Autores" },
    { id: "books", label: "Libros" },
    { id: "libraries", label: "Bibliotecas" },
  ]

  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          onClick={() => onTabChange(tab.id)}
          className="flex-1"
        >
          {tab.label}
        </Button>
      ))}
    </div>
  )
}
