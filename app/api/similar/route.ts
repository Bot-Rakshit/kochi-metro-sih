import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { openRouterClient } from "@/lib/openrouter"

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json()
    if (!content) return NextResponse.json({ error: "content is required" }, { status: 400 })

    const all = await prisma.document.findMany({ select: { id: true, content: true } })
    const scores = await openRouterClient.findSimilarDocuments(content, all.map((d) => d.content))

    const ranked = all
      .map((d, i) => ({ id: d.id, score: scores[i] || 0 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)

    return NextResponse.json({ similar: ranked })
  } catch (error) {
    console.error("/api/similar POST error", error)
    return NextResponse.json({ error: "Similarity failed" }, { status: 500 })
  }
}
