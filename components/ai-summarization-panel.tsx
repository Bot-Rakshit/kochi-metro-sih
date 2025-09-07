"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
const Streamdown = dynamic(async () => (await import("streamdown")).Streamdown, { ssr: false })
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  FileText,
  Clock,
  Users,
  Tag,
  CheckSquare,
  AlertCircle,
  Loader2,
  Copy,
  Download,
  Share,
} from "lucide-react"

interface SummarizationResult {
  summary: string
  department: string
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  tags: string[]
  actionItems: string[]
  deadline?: string
  stakeholders: string[]
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800 border-red-200"
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function AISummarizationPanel() {
  const [inputText, setInputText] = useState("")
  const [language, setLanguage] = useState<"english" | "malayalam">("english")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<SummarizationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSummarize = async () => {
    if (!inputText.trim()) return

    setIsProcessing(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-no-stream": "1",
        },
        body: JSON.stringify({
          content: inputText,
          language,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process document")
      }

      const data = (await response.json()) as SummarizationResult
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed")
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const exportResults = () => {
    if (!result) return

    const exportData = {
      summary: result.summary,
      metadata: {
        department: result.department,
        priority: result.priority,
        category: result.category,
        tags: result.tags,
        actionItems: result.actionItems,
        deadline: result.deadline,
        stakeholders: result.stakeholders,
      },
      processedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "document-analysis.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Document Summarization
          </CardTitle>
          <CardDescription>Paste document content for intelligent analysis and summarization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Document Content</label>
            <Textarea
              placeholder="Paste your document content here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px]"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select value={language} onValueChange={(value: "english" | "malayalam") => setLanguage(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="malayalam">Malayalam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1" />

            <Button onClick={handleSummarize} disabled={!inputText.trim() || isProcessing} className="gap-2">
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  Analyze Document
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Analysis Results</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.summary)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={exportResults}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="space-y-4">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
                <TabsTrigger value="actions">Action Items</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    AI-Generated Summary
                  </h4>
                  <div className="text-sm text-muted-foreground prose prose-sm max-w-none">
                    <Streamdown>{result.summary}</Streamdown>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <div className="text-lg font-bold text-primary">{result.department}</div>
                    <div className="text-xs text-muted-foreground">Department</div>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <Badge className={getPriorityColor(result.priority)}>{result.priority.toUpperCase()}</Badge>
                    <div className="text-xs text-muted-foreground mt-1">Priority</div>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <div className="text-lg font-bold">{result.category}</div>
                    <div className="text-xs text-muted-foreground">Category</div>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <div className="text-lg font-bold">{result.actionItems.length}</div>
                    <div className="text-xs text-muted-foreground">Action Items</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metadata" className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Stakeholders
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.stakeholders.map((stakeholder, index) => (
                        <Badge key={index} variant="outline">
                          {stakeholder}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {result.deadline && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Deadline
                      </h4>
                      <Badge variant="destructive">{result.deadline}</Badge>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CheckSquare className="h-4 w-4" />
                    Required Actions
                  </h4>
                  <div className="space-y-2">
                    {result.actionItems.map((action, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm flex-1">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
