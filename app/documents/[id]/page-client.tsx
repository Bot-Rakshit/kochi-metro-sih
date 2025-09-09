"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { notFound, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Define types inline to avoid Prisma import issues
type ReviewStatus = "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED"

interface Document {
  id: string
  title: string | null
  filename: string
  mimeType: string
  sizeBytes: number
  content: string
  language: string
  reviewStatus: ReviewStatus
  createdAt: Date
  updatedAt: Date
}

interface Summary {
  id: string
  documentId: string
  summary: string
  department: string
  priority: string
  category: string
  tags: string[]
  actionItems: string[]
  deadline: string | null
  stakeholders: string[]
  createdAt: Date
}

type DocWithSummary = Document & { summary: Summary | null }

export function DocumentPageComponent({ doc: initialDoc }: { doc: DocWithSummary | null }) {
  const [doc, setDoc] = useState(initialDoc)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setDoc(initialDoc)
  }, [initialDoc])

  if (!doc) return notFound()

  const sum = doc.summary || ({} as any)

  const handleStatusChange = async (status: ReviewStatus) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/documents/${doc.id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) throw new Error("Failed to update status")
      const updatedDoc = await response.json()
      setDoc((prev: DocWithSummary | null) => (prev ? { ...prev, reviewStatus: updatedDoc.reviewStatus } : prev))
      router.refresh()
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update status. See console for details.")
    } finally {
      setIsUpdating(false)
    }
  }
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{doc.title || doc.filename}</CardTitle>
              <CardDescription className="flex flex-wrap gap-2 items-center mt-2">
                <Badge variant="outline">{sum.department || "General"}</Badge>
                <Badge>{(sum.priority || "medium").toUpperCase()}</Badge>
                <Badge variant="secondary">{sum.category || "general"}</Badge>
                <Badge
                  className={cn("capitalize", {
                    "bg-yellow-100 text-yellow-800": doc.reviewStatus === "IN_REVIEW",
                    "bg-green-100 text-green-800": doc.reviewStatus === "APPROVED",
                    "bg-red-100 text-red-800": doc.reviewStatus === "REJECTED",
                    "bg-blue-100 text-blue-800": doc.reviewStatus === "PENDING",
                  })}
                >
                  {doc.reviewStatus.replace("_", " ").toLowerCase()}
                </Badge>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={isUpdating}>
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <>
                        Change Status <ChevronDown className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleStatusChange("PENDING")}>Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("IN_REVIEW")}>In Review</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("APPROVED")}>Approve</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("REJECTED")}>Reject</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
          {sum.summary || "No summary available."}
        </CardContent>
      </Card>

      {Array.isArray(sum.actionItems) && sum.actionItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Action Items</CardTitle>
            <CardDescription>Tasks extracted from this document</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              {sum.actionItems.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>Full document content</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap bg-muted/50 rounded-lg p-4">
          {doc.content}
        </CardContent>
      </Card>
    </div>
  )
}
