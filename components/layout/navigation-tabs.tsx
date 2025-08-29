"use client"
import { cn } from "@/lib/utils"

export type TabType = "autores" | "libros" | "bibliotecas"

interface NavigationTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  const tabs = [
    { id: "autores" as TabType, label: "Autores" },
    { id: "libros" as TabType, label: "Libros" },
    { id: "bibliotecas" as TabType, label: "Bibliotecas" },
  ]

  return (
    <div className="border-b">
      <div className="container mx-auto px-4">
        <nav className="flex space-x-8 justify-center" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
