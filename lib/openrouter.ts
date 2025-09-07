import OpenAI from "openai"

// OpenRouter API integration for KMRL document processing
export class OpenRouterClient {
  private client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", // Replace with your actual site URL
        "X-Title": "Kochi Metro SIH", // Replace with your actual site name
      },
    })
  }

  async summarizeDocument(
    content: string,
    language: "english" | "malayalam" = "english",
    documentType?: string,
    priority?: "low" | "medium" | "high" | "urgent",
  ): Promise<string> {
    const systemPrompt =
      language === "malayalam"
        ? `നിങ്ങൾ കൊച്ചി മെട്രോ റെയിൽ ലിമിറ്റഡിന്റെ (KMRL) ഒരു വിദഗ്ധ AI അസിസ്റ്റന്റാണ്. ഡോക്യുമെന്റുകൾ വിശകലനം ചെയ്ത് പ്രധാന പോയിന്റുകൾ സംഗ്രഹിക്കുന്നതിൽ വിദഗ്ധനാണ്.`
        : `You are an expert AI assistant for Kochi Metro Rail Limited (KMRL). You specialize in analyzing documents and extracting key actionable insights for metro operations staff.`

    const userPrompt =
      language === "malayalam"
        ? `ഈ KMRL ഡോക്യുമെന്റിന്റെ പ്രധാന പോയിന്റുകൾ സംഗ്രഹിക്കുക. പ്രധാന നടപടികൾ, സമയപരിധി, ഉത്തരവാദിത്തങ്ങൾ എന്നിവ ഉൾപ്പെടുത്തുക. ചുരുക്കമായി (പരമാവധി 120 വാക്കുകൾ), 4-6 ബുള്ളറ്റ് പോയിന്റുകളായി നൽകുക. Markdown ഉപയോഗിച്ച് പട്ടികയായി നൽകുക:\n\n${content}`
        : `Summarize this KMRL document focusing on key actionable items, deadlines, responsibilities, and operational impacts. Keep it very brief: 4-6 bullet points, max ~120 words total. Return as Markdown bullet list:\n\n${content}`

    try {
      const completion = await this.client.chat.completions.create({
        model: "openrouter/sonoma-dusk-alpha",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 300,
        temperature: 0.1,
      })
      return completion.choices[0]?.message?.content || "Summary could not be generated."
    } catch (error) {
      console.error("Error calling OpenRouter API:", error)
      throw new Error("Failed to generate document summary")
    }
  }

  async categorizeDocument(content: string): Promise<{
    department: string
    priority: "low" | "medium" | "high" | "urgent"
    category: string
    tags: string[]
    actionItems: string[]
    deadline?: string
    stakeholders: string[]
  }> {
    const prompt = `Analyze this KMRL document and provide a detailed categorization. Return a JSON object with:
    - department: primary KMRL department (Engineering, Safety, Operations, Finance, HR, Procurement, Legal, IT, Customer Service)
    - priority: urgency level (low, medium, high, urgent)
    - category: document type (maintenance, safety, financial, regulatory, operational, administrative, technical, compliance)
    - tags: relevant keywords/topics (max 5)
    - actionItems: specific actions required (max 3)
    - deadline: any mentioned deadline (YYYY-MM-DD format if found)
    - stakeholders: people/roles mentioned who need to act

    Document content:
    ${content.substring(0, 2000)}...`

    try {
      const completion = await this.client.chat.completions.create({
        model: "openrouter/sonoma-dusk-alpha",
        messages: [
          {
            role: "system",
            content: "You are an expert document analyst for KMRL. Always return valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 400,
        temperature: 0.1,
        response_format: { type: "json_object" },
      })

      const content_text = completion.choices[0]?.message?.content || "{}"

      try {
        const parsed = JSON.parse(content_text)
        return {
          department: parsed.department || "General",
          priority: parsed.priority || "medium",
          category: parsed.category || "general",
          tags: parsed.tags || [],
          actionItems: parsed.actionItems || [],
          deadline: parsed.deadline,
          stakeholders: parsed.stakeholders || [],
        }
      } catch {
        return {
          department: "General",
          priority: "medium" as const,
          category: "general",
          tags: [],
          actionItems: [],
          stakeholders: [],
        }
      }
    } catch (error) {
      console.error("Error categorizing document:", error)
      return {
        department: "General",
        priority: "medium" as const,
        category: "general",
        tags: [],
        actionItems: [],
        stakeholders: [],
      }
    }
  }

  async processBatch(documents: Array<{ id: string; content: string; language?: "english" | "malayalam" }>) {
    const results = []

    for (const doc of documents) {
      try {
        const [summary, categorization] = await Promise.all([
          this.summarizeDocument(doc.content, doc.language),
          this.categorizeDocument(doc.content),
        ])

        results.push({
          id: doc.id,
          success: true,
          summary,
          ...categorization,
        })
      } catch (error) {
        results.push({
          id: doc.id,
          success: false,
          error: error instanceof Error ? error.message : "Processing failed",
        })
      }
    }

    return results
  }

  async findSimilarDocuments(content: string, existingDocs: string[]): Promise<number[]> {
    const prompt = `Compare this document with the provided existing documents and return similarity scores (0-100) as a JSON array.

    New document:
    ${content.substring(0, 1000)}

    Existing documents:
    ${existingDocs.map((doc, i) => `${i}: ${doc.substring(0, 500)}`).join("\n\n")}`

    try {
      const completion = await this.client.chat.completions.create({
        model: "openrouter/sonoma-dusk-alpha",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.1,
        response_format: { type: "json_object" },
      })

      const content_text = completion.choices[0]?.message?.content || "[]"

      try {
        return JSON.parse(content_text)
      } catch {
        return existingDocs.map(() => 0)
      }
    } catch (error) {
      console.error("Error finding similar documents:", error)
      return existingDocs.map(() => 0)
    }
  }
}

// Initialize OpenRouter client with the provided API key
export const openRouterClient = new OpenRouterClient(process.env.OPENROUTER_API_KEY || "")
