
import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { NextRequest } from "next/server"
import { openRouterClient } from "@/lib/openrouter"

export const runtime = "edge"

const openai = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Kochi Metro SIH",
  },
})

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("/api/summarize: Missing OPENROUTER_API_KEY")
      return new Response("Missing OPENROUTER_API_KEY on server", { status: 500 })
    }

    console.time("/api/summarize total")
    const { content, language } = await req.json()
    console.log("/api/summarize: request received", {
      language,
      contentLength: typeof content === "string" ? content.length : 0,
    })

    if (!content) {
      console.warn("/api/summarize: missing content in request body")
      return new Response("Document content is required", { status: 400 })
    }

    const systemPrompt =
      language === "malayalam"
        ? `നിങ്ങൾ കൊച്ചി മെട്രോ റെയിൽ ലിമിറ്റഡിന്റെ (KMRL) ഒരു വിദഗ്ധ AI അസിസ്റ്റന്റാണ്. ഡോക്യുമെന്റുകൾ വിശകലനം ചെയ്ത് പ്രധാന പോയിന്റുകൾ സംഗ്രഹിക്കുന്നതിൽ വിദഗ്ധനാണ്.`
        : `You are an expert AI assistant for Kochi Metro Rail Limited (KMRL). You specialize in analyzing documents and extracting key actionable insights for metro operations staff.`

    const userPrompt =
      language === "malayalam"
        ? `ഈ KMRL ഡോക്യുമെന്റിന്റെ പ്രധാന പോയിന്റുകൾ സംഗ്രഹിക്കുക. പ്രധാന നടപടികൾ, സമയപരിധി, ഉത്തരവാദിത്തങ്ങൾ എന്നിവ ഉൾപ്പെടുത്തുക. ചുരുക്കമായി (പരമാവധി 120 വാക്കുകൾ), 4-6 ബുള്ളറ്റ് പോയിന്റുകളായി നൽകുക. Markdown ഉപയോഗിച്ച് പട്ടികയായി നൽകുക:\n\n${content}`
        : `Summarize this KMRL document focusing on key actionable items, deadlines, responsibilities, and operational impacts. Keep it very brief: 4-6 bullet points, max ~120 words total. Return as Markdown bullet list:\n\n${content}`

    // If client requests non-streaming (used by AI panel), return plain text
    const noStream = req.headers.get("x-no-stream") === "1"
    if (noStream) {
      console.log("/api/summarize: no-stream mode enabled")
      const [summary, categorization] = await Promise.all([
        openRouterClient.summarizeDocument(content, language),
        openRouterClient.categorizeDocument(content),
      ])
      console.timeEnd("/api/summarize total")
      return new Response(JSON.stringify({ summary, ...categorization }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    console.time("/api/summarize streamText")
    const result = await streamText({
      model: openai("openrouter/sonoma-dusk-alpha"),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    })
    console.timeEnd("/api/summarize streamText")
    const response = result.toTextStreamResponse()
    console.timeEnd("/api/summarize total")
    return response
  } catch (error) {
    console.error("/api/summarize: error", error)
    return new Response("Failed to process document", { status: 500 })
  }
}
