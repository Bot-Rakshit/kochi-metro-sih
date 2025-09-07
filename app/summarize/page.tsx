import { AISummarizationPanel } from "@/components/ai-summarization-panel"
import { Header } from "@/components/header"

export default function SummarizePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl font-bold text-balance">AI Document Summarization</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Advanced AI-powered analysis for KMRL documents with intelligent categorization and action item extraction
            </p>
          </div>
          <AISummarizationPanel />
        </div>
      </main>
    </div>
  )
}
