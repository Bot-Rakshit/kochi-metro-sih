import { DocumentSearch } from "@/components/document-search"
import { Header } from "@/components/header"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl font-bold text-balance">Document Search</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Find documents quickly with advanced filtering and AI-powered search across all KMRL departments
            </p>
          </div>
          <DocumentSearch />
        </div>
      </main>
    </div>
  )
}
