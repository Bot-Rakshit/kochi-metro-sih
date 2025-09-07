import { type NextRequest, NextResponse } from "next/server"
import { openRouterClient } from "@/lib/openrouter"

export async function POST(request: NextRequest) {
  try {
    const { content, language } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Document content is required" }, { status: 400 })
    }

    const [summary, categorization] = await Promise.all([
      openRouterClient.summarizeDocument(content, language).catch((err) => {
        console.error("Summarization failed:", err)
        return "Summary generation failed. Please try again."
      }),
      openRouterClient.categorizeDocument(content).catch((err) => {
        console.error("Categorization failed:", err)
        return {
          department: "General",
          priority: "medium" as const,
          category: "general",
          tags: [],
          actionItems: [],
          stakeholders: [],
        }
      }),
    ])

    return NextResponse.json({
      summary,
      ...categorization,
    })
  } catch (error) {
    console.error("Summarization error:", error)
    return NextResponse.json({ error: "Failed to process document" }, { status: 500 })
  }
}
