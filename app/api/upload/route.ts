import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { openRouterClient, generateTitleWithLLM } from "@/lib/openrouter"

export const runtime = "nodejs"

async function extractTextFromFile(file: File): Promise<{ text: string; mime: string; filename: string; size: number }> {
  const arrayBuffer = await file.arrayBuffer()
  const bytes = Buffer.from(arrayBuffer)
  const mime = file.type || "application/octet-stream"
  const filename = file.name
  const size = file.size

  if (mime.startsWith("text/")) {
    return { text: bytes.toString("utf8"), mime, filename, size }
  }

  return { text: `Attachment: ${filename} (${mime}), size ${size} bytes`, mime, filename, size }
}

function autoTitle(filename: string, content: string): string {
  const base = filename.replace(/\.[^/.]+$/, "").slice(0, 80)
  const firstLine = (content.split(/\r?\n/)[0] || "").slice(0, 80)
  if (firstLine && firstLine.toLowerCase() !== "attachment") return firstLine
  return base || "Document"
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get("file")
    const language = (form.get("language") as string) || "english"

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 })
    }

    const { text, mime, filename, size } = await extractTextFromFile(file)
    let title = autoTitle(filename, text)
    if (!title || title.toLowerCase() === "document" || title.toLowerCase().startsWith("attachment:")) {
      const llmTitle = await generateTitleWithLLM(openRouterClient, text, language as any)
      if (llmTitle) title = llmTitle
    }

    const [summary, categorization] = await Promise.all([
      openRouterClient.summarizeDocument(text, language as "english" | "malayalam"),
      openRouterClient.categorizeDocument(text),
    ])

    const document = await prisma.document.create({
      data: {
        title,
        filename,
        mimeType: mime,
        sizeBytes: size,
        content: text,
        language,
        summary: {
          create: {
            summary,
            department: categorization.department,
            priority: categorization.priority,
            category: categorization.category,
            tags: categorization.tags,
            actionItems: categorization.actionItems,
            deadline: categorization.deadline,
            stakeholders: categorization.stakeholders,
          },
        },
      },
    })

    return NextResponse.json({ id: document.id, title, summary, ...categorization })
  } catch (error) {
    console.error("/api/upload error", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
