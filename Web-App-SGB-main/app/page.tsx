import { Header } from "@/components/layout/header"
import { NavigationTabs } from "@/components/layout/navigation-tabs"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <NavigationTabs />
      </main>
    </div>
  )
}
